//run with mocha & chai
const FolderBuilder = require('../FolderBuilder');
const testData = require('./testData.js');
const expect = require('chai').expect;
require('dotenv').config();

const { dataToMerge, mergedData, DLdata, levels, refTemplate, dlElements, refDL } = testData;

const options = {
  domain: process.env.QA_TOUCH_DOMAIN,
  apiToken: process.env.QA_TOUCH_APITOKEN
};

var builder = new FolderBuilder(options);

describe('downlaod BDD test case steps', () => {
  it('Should download and add BDD test case steps', async () => {
    let res;
    try {
      res = await builder.downloadBddSteps({ ...mergedData });
    } catch (err) {
      console.log(err);
    }

    expect(JSON.stringify(res)).to.equal(JSON.stringify(DLdata));
  });
});

describe('Generate test case steps from template', () => {
  let newOptions = [
    {
      downloadSteps: false,
      isCucumber: true
    },
    {
      downloadSteps: false,
      isCucumber: false
    }
  ];

  let titles = ['Returns default BDD template', 'Returns default template'];

  for (let i = 0; i < refTemplate.length; i++) {
    let opt = { ...options, ...newOptions[i] };

    builder = new FolderBuilder(opt);

    (function (build) {
      it(titles[i], () => {
        let initEl = DLdata.projects[0].testRuns[0].results[0];

        expect(build.createTestSteps(initEl, levels[2])).to.be.eq(refTemplate[i]);
      });
    })(builder);
  }
});

describe('Generate test case steps from download', () => {
  let newOptions = {
    downloadSteps: true,
    isCucumber: true
  };

  let opt = { ...options, ...newOptions };
  builder = new FolderBuilder(opt);

  for (let i = 0; i < dlElements.length; i++) {
    it(`Process DL test case steps ${i + 1}`, () => {
      expect(builder.createTestSteps(dlElements[i], levels[2])).to.be.eq(refDL[i]);
    });
  }
});
