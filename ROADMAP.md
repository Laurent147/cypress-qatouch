# Package Roadmap
## Push function
* [x] Improve loading of secrets (e.g. apiToken) from more secured location
* [x] Concatenate multi test result for 1 test run key (logic, if 1 fail all fail)
* [x] Add dynamic configuration based on ID in the project and test run folders
  * [ ] Refactor projectKey and testRunId parsing function to account for edge cases

## Pull function
* [x] Add dynamic file ext from cypress.json
  * e.g. *.spec.js, *.spec.ts, *.test.js, *.test.ts
* [x] Add custom integration folder to create folders and test cases
* [x] Add filtering capabilities on projects and test runs
* [x] Add support for cypress-cucumber-preprocessor and Gherkin style feature files
* [ ] Add support for large (>50) dataset

## Other
* [x] Review README and add cucumber-preproc option explanationß
* [ ] (*WIP*) Add unit testing for package
* [ ] look into support for typescript and how to set it up

