// Run with cypress
import promisify from 'cypress-promise';
const QaTouch = require('../src/qatouchapi');
const testData = require('./testData.js');
const { testCaseList, bddCaseDef } = testData;

const options = {
  domain: Cypress.env('domain'),
  apiToken: Cypress.env('apiToken')
};

const api = new QaTouch(options);

describe('Environemnt load test', () => {
  it('Env variables should load', () => {
    console.log(Cypress);
    expect(options.domain).to.not.be.undefined;
    expect(options.apiToken).to.have.lengthOf(64);
  });
});

describe('Api tests', () => {
  it('should get list of all test cases for project vEyp', async () => {
    let res = await promisify(cy.wrap(api.getAllTestCases(testData.project)));
    expect(res).to.be.deep.eq(testCaseList);
  });

  it('should download BDD test case steps', async () => {
    let res = await promisify(
      cy.wrap(api.getBddTestCaseSteps(testData.project, testData.bddCaseId))
    );
    expect(res).to.be.eq(bddCaseDef);
  });

  it('should get empty string for non BDD test cases', async () => {
    let res = await promisify(
      cy.wrap(api.getBddTestCaseSteps(testData.project, testData.stepCaseId))
    );
    expect(res).to.be.eq('');
  });
});
