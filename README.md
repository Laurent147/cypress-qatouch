# Cypress / QA Touch API module

* Pulls down test cases with template test snippet including case key. Pull can be done by Project > Test run > Test Case

* Pushes test results into QA Touch system.

> ⚠️ Test Run Module structure isn't available through the public QA Touch api at the moment so all test cases are created in test run level folder

## Installation

```shell
$ npm i cypress-qatouch
```

## Reporter push usage
**1. Add reporter to cypress.json**
   
Ensure that your QA Touch API is enabled and generate your API keys. See https://doc.qatouch.com/#qa-touch-api

Add reporter to cypress.json file:

```Javascript

    ...
    "reporter": "cypress-qatouch-api",
    "reporterOptions": {
        "domain" : "your-domain",
        "apiToken": "your-token",
        "projectKey": "project-key",
        "testRunId": "test-run-id",
        "isModules": false //optional, default: false
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
**2. Make sure test case ID are in your test names**

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

**3. Run cypress tests**
```shell
    npx cypress run
or
    ./node_modules/.bin/cypress run
or
    npm test
```

if you choose last option update package.json with:
```json
{
    ...
    "script": {
        "test": "cypress run"
    }
    ...
}
```


## Test case pull-down and update

*in progress*

## Acknowledgments

* [PremnathM](https://github.com/premnathm) and [Ahilmurugesan](https://github.com/Ahilmurugesan), authors of the [cypress-qatouch-reporter](https://github.com/gitdckap/cypress-qatouch-reporter) repository that was forked.

## References
- https://www.npmjs.com/package/cypress-qatouch-api
- https://qatouch.com/
- https://help.qatouch.com/
- https://doc.qatouch.com/

