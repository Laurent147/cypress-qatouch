const   path        = require("path");
const   Qatouch     = require("./src/qatouchapi");
const   fs          = require("fs");

class FolderBuilder {
    /**
     * @constructor
     * @param {*} options 
     * json object {domain: string, apiToken: string, fileExt?: string = ".spec.js", 
     * integrationFolder: string = "/cypress/integration"}
     */
    constructor(options){
        this.validate(options, "domain");
        this.validate(options, "apiToken");

        this.qa = new Qatouch(options);

        options.isModules = options.isModules || false;
        options.fileExt = options.fileExt || ".spec.js";
        options.projectKeys = options.projectKeys || [];
        options.testRunKeys = options.testRunKeys || [];
        this.filters = {
            projectKeys: options.projectKeys,
            testRunKeys: options.testRunKeys
        }

        options.integrationFolder = options.integrationFolder || 'cypress/integration'
        this.baseFolderPath = path.join(process.cwd(), options.integrationFolder);
        
        if(!fs.existsSync(this.baseFolderPath)){
            let paths = options.integrationFolder.split("/");
            if(paths[0] == "." || paths[0] == "..") paths.shift()
            this.makeFolder(process.cwd(),paths)
        }

        /**
         * Describes the data structure of QA touch projects, sections and cases
         * as well as variable used for the recursive function updateFolder
        */
        if(options.isModules){
           this.levels = [
               {
                   array: "projects",
                   name: "project_name",
                   key: "project_key",
                   type: "folder"
               },
               {
                   array: "sections",
                   name: "section_name",
                   key: "section_key",
                   type: "folder"
               },
               {
                   array: "cases",
                   name: "case_title",
                   key: "case_key",
                   type: "file"
               }
           ];
        }else{
            this.levels = [
                {
                    array: "projects",
                    name: "project_name",
                    key: "project_key",
                    type: "folder"
                },
                {
                    array: "testRuns",
                    name: "testrun_name",
                    key: "testrun_key",
                    type: "folder"
                },
                {
                    array: "results",
                    name: "title",
                    key: "run_key",
                    type: "file"
                }
            ];
        }

        this.fileTemplate ={
            ext: options.fileExt,
            text: `
                describe("__", () => {
                    it("TR-__CaseId__ __CaseTitle__", () => {
                        //write test case final assertion here
                    })
                })
            `

        } 

    }

    /**
     * BuildQAData function
     * 
     * builds an object of all projects, modules and test cases in QA touch
     * @private
     * @returns <Promise> fulfills with QA Touch data object
     * @example
     * {projects: [{
     *          project_name: "Some Project",
     *           project_key: "xb7jb",
     *           sections:[{
     *                   section_name: "menu bar",
     *                   section_key: "jf8hs",
     *                   cases: [{
     *                       case_title: "Test logout link",
     *                       case_key: "mv750"
     *           }]
     *       }]
     *   }]}
     */
    async buildQaData(filters){
        let qaData = {
            projects: []
        };
    
        let projects = await this.qa.getAllProjects();
        qaData.projects.push(...projects)
    
        qaData.projects = qaData.projects.filter(proj => filters.projectKeys.indexOf(proj.project_key) >= 0)
    
        await Promise.all(
            qaData.projects.map(async proj => {
                proj.testRuns = [];
                let testRuns = await this.qa.getAllTestRuns(proj.project_key);
                proj.testRuns.push(...testRuns)

                proj.testRuns = proj.testRuns.filter(testRun => filters.testRunKeys.indexOf(testRun.testrun_key) >= 0)

                return await Promise.all(proj.testRuns.map(async testRun => {
                    testRun.results = [];
                    let results = await this.qa.getAllTestRunsResults(proj.project_key, testRun.testrun_key)
                    results ? testRun.results.push(...results) : "";
                    return testRun;
                }))
            })
        )
    
        return qaData;
    
    }   
    
    /**
     * updatefolder function
     * 
     * Recursively go through a qaTouch data object and creates folders  & file if they don't exist
     * @param {string} folderPath 
     * @param {object} data 
     * @param {number} levelsIndex 
     * @return void
     * @private
     */
    async updateFolder (folderPath, data, levelsIndex, levels, fileTemplate){
        const fsPromise = require("fs/promises");
        levelsIndex++
        const level = levels[levelsIndex];
    
        if(Array.isArray(data[level.array]) && data[level.array].length > 0){
            data[level.array].forEach(async el => {
                const addKey = (level.type == "file" ? `${fileTemplate.ext}` : `-${el[level.key]}`)
                const name = `${el[level.name]}${addKey}`
                if(!fs.existsSync(path.join(folderPath,name))){
                    if(level.type === "folder"){
                        fsPromise.mkdir(path.join(folderPath, name))
                        .then(fileHandle => {
                            console.log(`Folder ${name} has been created`);
                            this.updateFolder(path.join(folderPath, name), el, levelsIndex, levels, fileTemplate)
                        })
                        .catch( err => {
                            console.log(err);
                        })
                    }else if(level.type === "file"){
                        let fileName = name;
                        fsPromise.open(path.join(folderPath, fileName), "a")
                        .then(async fileHandle => {
                            console.log(`File ${fileName} has been created`);                        
                            
                            let testCase = fileTemplate.text;
                            testCase = testCase.replace(/__CaseId__/,el[level.key]);
                            testCase = testCase.replace(/__CaseTitle__/,el[level.name]);
                            await fsPromise.appendFile(fileHandle, testCase);
                            
                            console.log(`Template test case has been appended to file ${fileName}`);                        
    
                            fileHandle.close();
                        })
                        .catch(err => {
                            console.log(`The file creation didn't work error was:\n ${err}`);
                        })
                    }else{
                        console.error(`level type not recognized. please check level mapping array.`)
                    }
                }else{
                    console.log(`*** ${level.array} ${level.type} '${el[level.name]}' already exists`)
    
                    if (level.type === "folder" && el[levels[levelsIndex+1].array] && el[levels[levelsIndex+1].array].length > 0 ){             
                        this.updateFolder(path.join(folderPath, name), el, levelsIndex, levels, fileTemplate)
                    }
                }
            });
        }
    }

    buildFolders(){
        this.buildQaData(this.filters).then((res) => {
            this.updateFolder(this.baseFolderPath, res, -1, this.levels, this.fileTemplate);
        })
    }

    /**
     * Validate function
     *
     * Validates the existance of a key
     * @param {*} options reporterOptions object define in cypress.json
     * @param {string} name key to validate
     * @private
     */
    validate(options, name) {
        if (options == null) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        if (options[name] == null) {
            throw new Error("Missing " + name + " value. Please update reporterOptions in cypress.json");
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
    makeFolder(folderPath, paths) {
        if (paths.length > 0) {
            let newFolder = path.join(folderPath, paths[0])
            fs.mkdir(newFolder, () => {
                paths.shift();
                this.makeFolder(newFolder, paths);
            })
        } else {
            return;
        }
    }
}


module.exports = FolderBuilder;