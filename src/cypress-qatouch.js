'use strict';
const Qatouch         = require("./qatouchapi.js");
const Mocha           = require("mocha");

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

const Spec = Mocha.reporters.Spec;

/**
 * CypressQaTouchReporter class extends Mocha's spec reporter
 * 
 * Manages cypress/mocha test runner event and publishes results to QA Touch
 */
class CypressQaTouch extends Spec{
  /**
   * 
   * @param {*} runner 
   * @param {*} options
   * @constructor 
   */
  constructor(runner, options) {
    super(runner, options)
    
    this._indents = 0;
    this.results = [];
    
    const reporterOptions = options.reporterOptions;
    
    this.validate(reporterOptions, 'domain');
    this.validate(reporterOptions, 'apiToken');
    this.validate(reporterOptions, 'projectKey');
    this.validate(reporterOptions, 'testRunId');
    
    this.stats = runner.stats;
    this.qatouch = new Qatouch(reporterOptions);
    
    runner.once(EVENT_RUN_BEGIN, () => {
        console.log('start');
    })

    runner.on(EVENT_SUITE_BEGIN, () => {
      this.increaseIndent();
    })

    runner.on(EVENT_SUITE_END, () => {
      this.decreaseIndent();
    })

    runner.on(EVENT_TEST_PASS, test => {
      this.addToQatouchResults('Passed',test.title);
    })

    runner.on(EVENT_TEST_PENDING, test => {
      this.addToQatouchResults('Untested',test.title);
    })

    runner.on(EVENT_TEST_FAIL, (test, err) => {
      this.addToQatouchResults('Failed', test.title);
    })

    runner.once(EVENT_RUN_END, () => {
      console.log(`end: ${this.stats.passes}/${this.stats.passes + this.stats.failures} ok`);
      if (this.results.length === 0) {
        console.warn("No test cases were matched. Ensure that your tests are declared correctly and matches TRxxx");
        return;
      }

      this.determinePublishCalls(this.results)
      .then(values => console.log(values))

    })
    
  }

  /**
   * Validate function
   *
   * Validates the existance of a key
   * @param {*} options reporterOptions object define in cypress.json
   * @param {string} name key to validate
   */
  validate (options, name) {
    if (options == null) {
      throw new Error('Missing reporterOptions in cypress.json');
    }
    if (options[name] == null) {
      throw new Error("Missing " + name + " value. Please update reporterOptions in cypress.json");
    }
  }

  /**
   * AddToQatouchResults function
   * Format and add test results to qatouch results array
   *
   * @param {string} status the status of the test
   * @param {string} title the title of the test
   * @returns {object} results array [{case_id: number, status_id: number}]
   */
  addToQatouchResults (status,title) {
    let status_id = Qatouch.statusConfig(status);
    let caseIds = Qatouch.titleToCaseIds2(title);

    let results = caseIds.map(caseId => {
      return {
        case: caseId,
        status: (Number.isFinite(caseId) ? status_id : status.toLowerCase()),
        statusId: status_id
      };
    });
    this.results.push(...results);  
  }

  /**
   * determinePublishCall function
   * 
   * Split results array between number or string base results and make respective api call
   * @param {*} resArr array of test restults [{case: string | number, status: string | number}]
   * @returns < Promise > fulfills array of api call results [{success: boolean, msg: string}]
   */
  async determinePublishCalls(resArr){
    let multiPublish = resArr.filter(el => Number.isFinite(el.case));
    let singlePublish = resArr.filter(el => !Number.isFinite(el.case));

    let msg = [];

    multiPublish = this.dedupeAndValidateStatus(multiPublish);
    singlePublish = this.dedupeAndValidateStatus(singlePublish);

    console.log(`results to be pushed: ${JSON.stringify([...multiPublish,...singlePublish])}`);

    if (multiPublish.length > 0) {
      msg.push(this.qatouch.publishResults(multiPublish));
    }
    if (singlePublish.length > 0) {
      msg.push(...singlePublish.map(async (result) => this.qatouch.publishOneResult(result)))
    }

    return Promise.all(msg)
  }
  
  dedupeAndValidateStatus(arr) {
    let newArr = []
    arr.sort((a, b) => ("" + a.case).localeCompare(("" + b.case)))
      .forEach((el, i, a) => {
        if (i != 0 && el.case == a[i - 1].case) {
          if ( el.statusId >= a[i - 1].statusId ) newArr.splice(newArr.length - 1, 1, el)
        } else {
          newArr.push(el);
        }
      })
    return newArr;
  }

  //All the indent function arent' really used much
  /**
   * Indent function
   *
   * @param indent
   * @returns {string}
   */
  indent (indent) {
    return Array(indent).join('  ');
  }

  /**
   * Increase Indent function
   */
  increaseIndent() {
    this._indents++;
  }

  /**
   * Decrease Indent function
   */
  decreaseIndent() {
    this._indents--;
  }

}

module.exports = CypressQaTouch;