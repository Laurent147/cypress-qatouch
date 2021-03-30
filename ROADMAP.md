# Package Roadmap
## Push function
* [ ] Add dynamic configuration based on ID in the project and test run folders
* [ ] Improve loading of secrets (e.g. apiToken) from more secured location
* [ ] Concatenate multi test result for 1 test run key (logic, if 1 fail all fail)

## Pull function
* [x] Add dynamic file ext from cypress.json
  * e.g. *.spec.js, *.spec.ts, *.test.js, *.test.ts
* [x] Add custom integration folder to create folders and test cases
* [x] Add filtering capabilities on projects and test runs
* [ ] Add support for cypress-cucumber-preprocessor and Gherkin styl feature files

## Other
* [ ] Add unit testing for package
* [ ] Review README and add cucumber-preproc option explanation
* [ ] look into support for typescript and how to set it up