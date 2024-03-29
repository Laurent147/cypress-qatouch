# Cypress / QA Touch integration package <!-- omit in toc -->

<img src="./src/assets/qa-cyLogo.png">

# Table of Content <!-- omit in toc -->
- [Get Started](#get-started)
  - [Features](#features)
  - [Installation](#installation)
  - [⚠️ Limitations ⚠️](#️-limitations-️)
- [Reporter push usage](#reporter-push-usage)
  - [1. Add reporter to cypress.json](#1-add-reporter-to-cypressjson)
    - [Secure your QA Touch credentials](#secure-your-qa-touch-credentials)
    - [Dynamic project and test run config](#dynamic-project-and-test-run-config)
  - [2. Make sure test case ID are in your test names](#2-make-sure-test-case-id-are-in-your-test-names)
  - [3. Run cypress tests](#3-run-cypress-tests)
- [Test case pull-down and update](#test-case-pull-down-and-update)
  - [1. Create a qaPull.js file to require and invoke the folder builder function](#1-create-a-qapulljs-file-to-require-and-invoke-the-folder-builder-function)
  - [2. Set up package.json script to launch the file](#2-set-up-packagejson-script-to-launch-the-file)
  - [3. Run npm command](#3-run-npm-command)
- [Using Gherkin / Cucumber](#using-gherkin--cucumber)
  - [1. Set-up](#1-set-up)
  - [2. Pulling down from QA touch](#2-pulling-down-from-qa-touch)
  - [3. Pushing to QA touch](#3-pushing-to-qa-touch)
- [Acknowledgments](#acknowledgments)
- [References](#references)

# Get Started
## Features

* Pulls down test cases with template test snippet including case key. Scafolding will be as followed:

         Project > Test run > Test Case

* Pushes test results into QA Touch system.

## Installation

```shell
$ npm i cypress-qatouch
```

## ⚠️ Limitations ⚠️
From QA Touch:
* Test Run Module structure isn't available through QA Touch's api at the moment so all test cases are created in test run level folder.

From the package:
* Test case step download, only available for BDD test case
* Using multiple time the same test case Id in a test file will result in an all or nothing "passed" logic. All test within a test file with the same ID must "pass" to report "passed" to QA Touch.


# Reporter push usage
## 1. Add reporter to cypress.json

Ensure that your QA Touch API is enabled and generate your API keys. See https://doc.qatouch.com/#qa-touch-api

Add reporter to cypress.json file:

```Javascript

    ...
    "reporter": "cypress-qatouch-api",
    "reporterOptions": {
        "domain" : "your-domain",
        "apiToken": "your-token",
        "projectKey": "project-key",
        "testRunId": "test-run-id"
    },
    ...

```
Options definitions

```Json
domain: "<string> domain name of your QA Touch instance (e.g. yourDomain.qatouch.com)"
apiToken: "<string> API token for user which can be created in the edit profile menu in your domain login"
projectKey: "<string> `project key with which the tests are associated. Can be found in the browser URI when on your project page"
            //(e.g. vEyp from yourDomain.qatouch.com/project/overview/p/vEyp)
testRunID: "<string> test run Id with which the tests are associated.Can be found in the browser URI when on your test run page"
            //(e.g.g67W from yourDomain.qatouch.com/testrun/p/vEyp/tid/g67W)
```

### Secure your QA Touch credentials
To load QA Touch's domain and apiToken information from environment variables add the following code to cypress/plugins/index.js (don't forget to remove the attributes for cypress.json)

```javascript

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
 
  if(config.reporterOptions){
    require('dotenv').config(); //make sure to have dotenv package installed
    config.reporterOptions.domain = process.env.QA_TOUCH_DOMAIN;
    config.reporterOptions.apiToken = process.env.QA_TOUCH_APITOKEN;

    return config;
  }
}
```

Here npm's [dotenv package](https://www.npmjs.com/package/dotenv) is used to load environment variables from a root .env but you can use your prefered method.

Template .env file:
```
QA_TOUCH_DOMAIN=
QA_TOUCH_APITOKEN=
```

### Dynamic project and test run config
If folders have been pulled down with this package, the projectKey and testRunId added in the name of the folders will be parsed and override any configuration from cypress.json

Folder Ids will be ignored if the path to the test file:
* doesn't have any P-xxxx or R-xxxx Ids
* only has one of the 2 required Ids
* has more than 2 recognized patterns

## 2. Make sure test case ID are in your test names

If you pulled down the test cases through the integration, make sure to rename the suite and write your tests within the template test included.
Suite name has no effect on the push to QA Touch.

```Javascript
describe("__", () => {
    it("TR-48alw title_of_your_testCase", () => {
        //write test case final assertion here
    })
})
```

If you manually created your test file, make sure:
* Place the file in the right test run folder base on your Qa Touch set up
* To add your cypress test ID from the test run test cases in the test name. Ensure that your case ids are well distinct from test descriptions.
 
```Javascript
it("TR0001 Authenticate with invalid user")
it("TR0002 Authenticate TR0001 with invalid user")
it("Authenticate with invalid user TR0003")
```

Only passed, untested and failed tests will be published in QA Touch Test Run.

## 3. Run cypress tests
```shell
   $ npx cypress run
or
   $ ./node_modules/.bin/cypress run
or
   $ npm test
```

if you choose the last option update package.json with:
```json
    ...
    "script": {
        "test": "cypress run"
    }
    ...
```


# Test case pull-down and update
The pull down function only re-create in cypress' integration folder the projects and test runs as folders, including their respective keys. It will then create a test file for each test case within the testrun. 

Test file can be created either based on:
* Template (default or gherkin/cucumber) 

  Each file will include the test case title and test run key (which is used to report back to QA Touch). If a file already exist **it will be ignored**.
* The BDD steps defined in QA Touch.

  Each file will include the BDD steps from QA Touch and the test run key merged into `Scenario` tag. If a file already exist, **the content will be replaced by QA Touch content if different**.

  >⚠️ Only work for BDD (cucumber/gherkin) test cases, not for Steps test cases.

Default template code example for js:
```javascript
describe("__", () => {
    it("TR-wE8hf button should do something when clicked", () => {
        //write test case final assertion here
    })
})

```
Default template code example for Gherkin/cucumber:
```Gherkin
Feature: Button should do something when clicked
  Scenario: TR-wE8hf Button should do something when clicked
    Given
    When
    Then
```

## 1. Create a qaPull.js file to require and invoke the folder builder function
```javascript
const Builder = require("cypress-qatouch/FolderBuilder");
const options = {}
new Builder(options).buildFolders();
```

**Options:**
```javascript
options = {
    domain: process.env.QA_TOUCH_DOMAIN,
    apiToken: process.env.QA_TOUCH_APITOKEN,
    integrationFolder: "your/custom/cypress/integration/folder", // Optional. Default: "cypress/integration"
    projectKeys: ["key1", "key2"], // Optional. Default: [] (all projects)
    testRunKeys: ["keyA", "keyB"], // Optional. Default: [] (all test runs)
    isCucumber: true, // Optional. Default: false
    downloadSteps: true, // Optional. Default: false
    fileExt: ".your.ext.js" //Optional. Default: ".spec.js"
}
```
* ⚠️ **domain** and **apiToken** can be hard coded your in the file for testing but it's more secure to load it from environment variable or secret manager. if you've done the set-up from "Secure your QA Touch credentials" (above section) then you can just add `require("dotenv").config()` at the top of your file.
  
* **IntegrationFolder** folder path should be relative to node current working directory (process.cwd()). If the folders don't exist, they will be created before pulling down data from QA Touch.
  
* **projectKeys** and **testRunKeys** can be used to filter creation of folders/files to a sub-set of projects and test runs which your api key has access to. If omitted, the script will pull all.
  
* **isCucumber** flag is used to determine whether to create cucumber style test case files or regular one. *See using Gherkin / Cucumber section below*

* **downloadSteps** flag is used to enable downloading of BDD test case steps from QA touch, mergin required testrun key used for reporting into Scenario statements and insert that into the `.feature` file (instead of the BDD template).
  * If the `.feature` file already exist, the content will be replaced by QA Touch content if different. 
  * Step definition files are not checked or updated.
  * ⚠️ **isCucumber** must be **true**

* **fileExt** determines the file extension for the test case scripts. If isCucumber is set to true then this would be the file extension for the step definition file.

## 2. Set up package.json script to launch the file
```json
{
    "script": {
        "qaPull": "node ./path/to/qaPull.js"
    }
}
```
## 3. Run npm command
```shell
$ npm run qaPull
```
# Using Gherkin / Cucumber
## 1. Set-up
install cypress-cucumber-preprocessor
```shell
$ npm i -D cypress-cucumber-preprocessor
```
Add to package.json 
```json
...
  "cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": true
  }
...
```

Add preprocessor to cypress/plugins/index.js
```javascript
const cucumber = require('cypress-cucumber-preprocessor').default;
require('dotenv').config();

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {

    config.reporterOptions.domain = process.env.QA_TOUCH_DOMAIN;
    config.reporterOptions.apiToken = process.env.QA_TOUCH_APITOKEN;

    on('file:preprocessor', cucumber());

  return config;
  }
}
```


Find more set-up information for the cypress-cucumber-preprocessor package on their [GitHub repo](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)

## 2. Pulling down from QA touch
add cucumber flag to qaPull.js options object
```Json
...
  isCucumber: true,
  downloadSteps: true // Optional 
...
```
then use the npm script set-up previously
```shell
$ npm run qaPull
```


## 3. Pushing to QA touch
If you didn't use the package to pull down the feature files, ake sure that the test case Ids (TR0001 or TR-eG5d) are added to the title of the **Scenario** tag
```Gherkin
Feature: Some feature title
    Scenario: TR0001 some title TR-shE9D of a Test case TR0002
        Given some situation
        When something happens
        Then expect a certain result
```

Replace testFiles value in cypress.json
```json
...
"testFiles": "**/*.{feature, features}"
...
```

launch test
```shell
$ npm test
```

# Acknowledgments

* [PremnathM](https://github.com/premnathm) and [Ahilmurugesan](https://github.com/Ahilmurugesan), authors of the [cypress-qatouch-reporter](https://github.com/gitdckap/cypress-qatouch-reporter) repository that was forked.

# References
- [QA Touch home](https://qatouch.com/)
- [QA Touch help](https://help.qatouch.com/)
- [QA Touch api doc](https://doc.qatouch.com/)
- [Cypress home](https://www.cypress.io/)
- [Cypress doc](https://docs.cypress.io/guides/overview/why-cypress)
- [Cucumber Gherkin doc](https://cucumber.io/docs/gherkin/reference/)

