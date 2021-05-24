require('dotenv').config();

const Builder = require('../FolderBuilder');
options = {
  domain: process.env.QA_TOUCH_DOMAIN, //from .env
  apiToken: process.env.QA_TOUCH_APITOKEN, //from .env
  fileExt: '.spec.js',
  integrationFolder: 'cypress/integration/laurentTest2',
  projectKeys: [], //"vEyp"
  testRunKeys: [],
  downloadSteps: true,
  isCucumber: !process.env.IS_CUCUMBER || process.env.IS_CUCUMBER == 'false' ? false : true //from cli
};

new Builder(options).buildFolders();
