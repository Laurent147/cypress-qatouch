const path = require('path');
const Qatouch = require('./src/qatouchapi');
const fs = require('fs');

class FolderBuilder {
  /**
   * @constructor
   * @param {*} options
   * json object {domain: string, apiToken: string, fileExt?: string = ".spec.js",
   * integrationFolder?: string = "/cypress/integration",projectKeys?: string[] = [],
   * testRunKeys?: string[] = []}
   */
  constructor(options) {
    let _options = { ...options };

    this.validate(_options, 'domain');
    this.validate(_options, 'apiToken');

    this.qa = new Qatouch(_options);

    _options.isModules = _options.isModules || false;

    _options.projectKeys = _options.projectKeys || [];
    _options.testRunKeys = _options.testRunKeys || [];
    this.filters = {
      projectKeys: _options.projectKeys,
      testRunKeys: _options.testRunKeys
    };

    _options.fileExt = _options.fileExt || '.spec.js';
    _options.downloadSteps = _options.downloadSteps || false;
    _options.isCucumber = _options.isCucumber || false;
    _options.cuExt = '.feature';

    this.fileTemplate = {
      isCucumber: _options.isCucumber,
      ext: _options.isCucumber ? [_options.cuExt, _options.fileExt] : [_options.fileExt],
      text: _options.isCucumber
        ? 'Feature: __CaseTitle__\n' +
          '\tScenario: __CaseId__ __CaseTitle__\n' +
          '\t\tGiven\n' +
          '\t\tWhen\n' +
          '\t\tThen\n'
        : 'describe("__", () => {\n' +
          '\tit("__CaseId__ __CaseTitle__", () => {\n' +
          '\t\t//write test case final assertion here\n' +
          '\t})\n' +
          '})\n'
    };

    _options.integrationFolder = _options.integrationFolder || 'cypress/integration';
    this.baseFolderPath = path.join(process.cwd(), _options.integrationFolder);

    if (!fs.existsSync(this.baseFolderPath)) {
      let paths = _options.integrationFolder.split('/');
      if (paths[0] == '.' || paths[0] == '..') paths.shift();
      this.makeFolder(process.cwd(), paths);
    }

    /**
     * Describes the data structure of QA touch projects, sections and cases
     * as well as variable used for the recursive function updateFolder
     */
    if (options.isModules) {
      this.levels = [
        {
          array: 'projects',
          name: 'project_name',
          keyId: 'P-',
          key: 'project_key',
          type: 'folder'
        },
        {
          array: 'sections',
          name: 'section_name',
          keyId: 'S-',
          key: 'section_key',
          type: 'folder'
        },
        {
          array: 'cases',
          name: 'case_title',
          keyId: 'C-',
          key: 'case_key',
          type: 'file'
        }
      ];
    } else {
      this.levels = [
        {
          array: 'projects',
          name: 'project_name',
          keyId: ' P-',
          key: 'project_key',
          type: 'folder'
        },
        {
          array: 'testRuns',
          name: 'testrun_name',
          keyId: ' R-',
          key: 'testrun_key',
          type: 'folder'
        },
        {
          array: 'results',
          name: 'title',
          keyId: 'TR-',
          key: 'run_key',
          steps: 'caseSteps',
          caseId: 'case_key',
          type: 'file'
        }
      ];
    }

    this.options = _options;
  }

  /**
   * BuildQAData function
   *
   * builds an object of all projects, modules and test cases in QA touch
   * @param {} filters object defining filters for project and test run. {projectKeys: string, testRunKeys: string}
   * @private
   * @returns <Promise> fulfills with QA Touch data object
   * @example
   * {projects: [{
   *          project_name: "Some Project",
   *           project_key: "xb7jb",
   *           testRuns:[{
   *                   testrun_name: "menu bar",
   *                   testrun_key: "jf8hs",
   *                   results: [{
   *                      title: "Test logout link",
   *                      run_key: "mv750"
   *                      status: "Failed",
   *                      assigned_user: "John Doe"
   *           }]
   *       }]
   *   }]}
   */
  async buildQaData(filters) {
    let qaData = {
      projects: []
    };

    let projects = await this.qa.getAllProjects();
    qaData.projects.push(...projects);

    if (filters.projectKeys.length > 0)
      qaData.projects = qaData.projects.filter(
        (proj) => filters.projectKeys.indexOf(proj.project_key) >= 0
      );

    await Promise.all(
      qaData.projects.map(async (proj) => {
        proj.testRuns = [];
        let testRuns = await this.qa.getAllTestRuns(proj.project_key);
        proj.testRuns.push(...testRuns);

        if (filters.testRunKeys.length > 0) {
          proj.testRuns = proj.testRuns.filter(
            (testRun) => filters.testRunKeys.indexOf(testRun.testrun_key) >= 0
          );
        }

        return await Promise.all(
          proj.testRuns.map(async (testRun) => {
            testRun.results = [];
            let results = await this.qa.getAllTestRunsResults(
              proj.project_key,
              testRun.testrun_key
            );
            results ? testRun.results.push(...results) : '';
            return testRun;
          })
        );
      })
    );

    return qaData;
  }

  /**
   * updatefolder function
   *
   * Recursively go through a qaTouch data object and creates folders  & file if they don't exist
   * @param { string } folderPath root folder in which the folders and files will be created
   * @param { object } data data object which follows the level pattern
   * @param { number } levelsIndex tracks the level at which the recursion is at
   * @param { object } levels object representing the structure of the data (levels)
   * @param { object } fileTemplate object which includes the template string to add to the files
   * @return void
   * @private
   */
  async updateFolder(folderPath, data, levelsIndex, levels, fileTemplate) {
    const fsPromise = require('fs/promises');
    levelsIndex++;
    const level = levels[levelsIndex];

    if (Array.isArray(data[level.array]) && data[level.array].length > 0) {
      data[level.array].forEach(async (el) => {
        const addKey =
          level.type == 'file' ? `${fileTemplate.ext[0]}` : `${level.keyId}${el[level.key]}`;
        const name = `${el[level.name]}${addKey}`;

        if (!fs.existsSync(path.join(folderPath, name))) {
          if (level.type === 'folder') {
            fsPromise
              .mkdir(path.join(folderPath, name))
              .then((fileHandle) => {
                console.log(`Folder ${name} has been created`);
                this.updateFolder(
                  path.join(folderPath, name),
                  el,
                  levelsIndex,
                  levels,
                  fileTemplate
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (level.type === 'file') {
            let testCase = this.createTestSteps(el, level);

            let file = {
              fileName: el[level.name],
              fileExt: fileTemplate.ext,
              content: testCase
            };

            createTemplateFiles(folderPath, file, fileTemplate.isCucumber);
          } else {
            console.error(`level type not recognized. please check level mapping array.`);
          }
        } else {
          if (this.options.downloadSteps && level.type === 'file') {
            let testCase = this.createTestSteps(el, level);
            fsPromise
              .readFile(path.join(folderPath, name), { encoding: 'utf8' })
              .then((content) => {
                if (content.localeCompare(testCase) === 0) {
                  console.log(`*** ${level.type} '${el[level.name]}' already exists`);
                } else {
                  console.log(`### ${level.type} '${el[level.name]}' has been updated`);
                  let file = {
                    fileName: el[level.name],
                    fileExt: fileTemplate.ext,
                    content: testCase
                  };

                  createTemplateFiles(folderPath, file, false);
                }
              });
          } else {
            console.log(`*** ${level.array} ${level.type} '${el[level.name]}' already exists`);
          }

          if (
            level.type === 'folder' &&
            el[levels[levelsIndex + 1].array] &&
            el[levels[levelsIndex + 1].array].length > 0
          ) {
            this.updateFolder(path.join(folderPath, name), el, levelsIndex, levels, fileTemplate);
          }
        }
      });
    }

    /**
     * Create template file or file(s) & folder depending whether isCucumber flag is false or true
     *
     * @param {string} rootfolderPath base folder where the files should be created
     * @param {string[]} file file object -> {fileName: string, fileExt:string[], content: string}
     * @param {boolean} isCucumber flag whether should create cucumber structure or not
     */
    function createTemplateFiles(rootfolderPath, file, isCucumber = false) {
      makeFile(rootfolderPath, `${file.fileName}${file.fileExt[0]}`, file.content)
        .then(async () => {
          if (isCucumber) {
            fsPromise
              .mkdir(path.join(rootfolderPath, file.fileName))
              .then((fileHandle) => {
                console.log(`Folder ${file.fileName} has been created`);
                makeFile(
                  path.join(rootfolderPath, file.fileName),
                  `${file.fileName}${file.fileExt[1]}`
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          throw err;
        });
    }

    /**
     *
     * @param {*} rootfolderPath full path to the folder where files should be created (incl. cwd)
     * @param {*} fileName name of the file including file extension
     * @param {*} templateText template text which need to be added to the file
     */
    async function makeFile(rootfolderPath, fileName, templateText = '') {
      fsPromise
        .open(path.join(rootfolderPath, fileName), 'w')
        .then(async (fileHandle) => {
          console.log(`File ${fileName} has been created`);

          await fsPromise.appendFile(fileHandle, templateText);

          console.log(`Template test case has been appended to file ${fileName}`);

          fileHandle.close();
        })
        .catch((err) => {
          console.log(`The file creation didn't work error was:\n ${err}`);
          return err;
        });
    }
  }

  /**
   * Validate function
   *
   * Validates the existance of a key
   * @param {*} opt reporterOptions object define in cypress.json
   * @param {string} name key to validate
   * @private
   */
  validate(opt, name) {
    if (opt == null) {
      throw new Error('Missing reporterOptions in cypress.json');
    }
    if (opt[name] == null) {
      throw new Error('Missing ' + name + ' value. Please update reporterOptions in cypress.json');
    }
  }

  /**
   * Recursively creates folders based on a supplied array of names.
   * Folders are created in the order of the array.
   *
   * @param {string} folderPath base folder where the folders should be created
   * @param {string[]} paths array of folder names
   * @returns
   */
  makeFolder(rootfolderPath, paths) {
    if (paths.length > 0) {
      let newFolder = path.join(rootfolderPath, paths[0]);
      fs.mkdir(newFolder, () => {
        paths.shift();
        this.makeFolder(newFolder, paths);
      });
    } else {
      return;
    }
  }

  mergeTestCaseID(data) {
    data.projects = data.projects.map((proj) => {
      let testCases = proj.testCases;
      proj.testRuns = proj.testRuns.map((testRun) => {
        testRun.results = testRun.results.map((res) => {
          res.case_key = testCases.find((val) => val.case_title === res.title).case_key;
          return res;
        });
        return testRun;
      });
      return proj;
    });
    return data;
  }

  async downloadBddSteps(data) {
    data.projects = await Promise.all(
      data.projects.map(async (proj) => {
        proj.testRuns = await Promise.all(
          proj.testRuns.map(async (testRun) => {
            testRun.results = await Promise.all(
              testRun.results.map(async (res) => {
                res.caseSteps = await this.qa.getBddTestCaseSteps(proj.project_key, res.case_id);
                return res;
              })
            );
            return testRun;
          })
        );
        return proj;
      })
    );
    return data;
  }

  createTestSteps(el, level) {
    let _fileTemplate = this.fileTemplate;
    let testCase = '';
    let testID = `${level.keyId}${el[level.key]}`;
    let testTitle = el[level.name];

    if (this.options.downloadSteps && this.options.isCucumber && el[level.steps] !== '') {
      testCase += el[level.steps];

      testCase = this.mergeDlTestCase(testCase, testID, testTitle);

      testCase = `# Test case key: ${el[level.caseId]}\n\n` + testCase;
    } else {
      testCase += _fileTemplate.text;
      testCase = testCase.replace(/__CaseId__/, testID);
      testCase = testCase.replace(/__CaseTitle__/g, testTitle);
    }

    return testCase;
  }

  mergeDlTestCase(stepsText, scenarioId, scenarioText) {
    //replaces all kind of line feed by '__lineFeed__'
    stepsText = stepsText.replace(/(\t)/gm, '');
    stepsText = stepsText.replace(/(\r\n|\r|\n)/gm, '__lineFeed__');
    let stepsArr = stepsText.split('__lineFeed__');
    if (stepsArr[stepsArr.length - 1] === '') stepsArr.pop();

    let nextScenario = true;
    let indentation = ['\t'];
    stepsText = stepsArr.reduce((acc, cur) => {
      if ((nextScenario && cur.indexOf('Background') < 0) || cur.indexOf('Scenario') > -1) {
        if (!nextScenario) indentation.pop();
        nextScenario = false;
        let newline = `\n${indentation.join('')}`;
        cur =
          cur.indexOf('Scenario') > -1
            ? `${newline}${cur.replace('Scenario :', `Scenario : ${scenarioId}`)}`
            : `${newline}Scenario : ${scenarioId} ${scenarioText}${newline}\t${cur}`;

        indentation.push('\t');
        return acc + cur;
      }

      if (cur.indexOf('Background') > -1) cur = `${cur.replace(/Background/, `Background:`)}`;

      return acc + '\n' + indentation.join('') + cur;
    });

    stepsText = stepsText.replace(/(\s:)/gm, ':');

    return stepsText + '\n';
  }

  buildFolders() {
    this.buildQaData(this.filters).then(async (res) => {
      if (this.options.downloadSteps) {
        console.log(JSON.stringify(res, null, 2));
        res = await this.downloadBddSteps(res); //this.mergeTestCaseID(res));
      }
      this.updateFolder(this.baseFolderPath, res, -1, this.levels, this.fileTemplate);
    });
  }
}

module.exports = FolderBuilder;
