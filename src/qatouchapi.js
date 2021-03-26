const   axios   = require('axios');

class Qatouch{
    constructor(options){
        this.options = options;
        this.baseUrl = "https://api.qatouch.com/api/v1/"
    }

    /**
     * Form the url for api
     *
     * @param path
     * @returns {string}
     * @private
     */
    _url(path){
        return `${this.baseUrl}${path}`;
    }

    /**
     * Retrieve list of all project associated to the user QA Touch
     *
     * @param 
     * @returns promise ({project_name: string, project_key: string})
     */
    getAllProjects(){
        let endPoint = `getAllProjects`;

        return this.qaTouchApiCall('GET',endPoint)
    }

    /**
     * Retrieve list of all project associated to the user QA Touch
     *
     * @param 
     * @returns promise with project count
     */
    getProjectCount(){
        let endPoint = `count/allProjects`;

        return this.qaTouchApiCall('GET',endPoint, true)
    }

    /**
     * Retrieve list of all moduels for a QA Touch project ID
     *
     * @param projectKey string id of the QA touch project
     * @returns promise 
     */
    getAllModules(projectKey){
        let endPoint = `getAllModules/${projectKey}`;

        return this.qaTouchApiCall('GET', endPoint)
    }

    /**
     * Retrieve list of all test cases for a QA Touch project ID
     *
     * @param projectKey string id of the QA touch project
     * @param options option object defining additional filtering parameters
     * for get request. {moduleKey:string, mode: string, view: string, requirementKey: string}
     * @returns promise 
     */
    getAllTestCases(projectKey, options = null){
        let endPoint = `getAllTestCases/${projectKey}`;
        if(options){
            endPoint += "?";
            for(let key in options){
                endPoint += `${key}=${options[key]}&`
            }
            endPoint = endPoint.substr(0,endPoint.length - 1);
        }

        return this.qaTouchApiCall('GET', endPoint)
    }

    /**
     * getAllTestRuns function
     * 
     * Retrieve list of all test runs for a QA Touch project ID
     * @param projectKey string id of the QA touch project
     * @returns promise 
     */
    getAllTestRuns(projectKey){
        let endPoint = `getAllTestRuns/${projectKey}`;

        return this.qaTouchApiCall('GET', endPoint)
    }

    /**
     * getAllTestRunsResults
     * 
     * Retrieve list of all test runs results for a QA Touch project ID
     * @param {string} projectKey id of the QA touch project
     * @param {string} testRunKey id of the QA touch test run
     * @returns <Promise> fulfills json object with all project test run results 
     */
    getAllTestRunsResults(projectKey, testRunKey){
        let endPoint = `testRunResults/${projectKey}/${testRunKey}`;

        return this.qaTouchApiCall('GET', endPoint)
    }


    /**
     * publishKey function
     * 
     * Publish the array of test results to QA Touch
     * @param   {*} results array of test results. [{case: number, status: number}]
     * @returns <Promise> fulfills json object {sucess: boolean, msg: string}
     */
    publishResults(results) {

        let endPoint = `testRunResults/status/multiple?project=${this.options.projectKey}
                        &test_run=${this.options.testRunId}&result=${JSON.stringify(results)}
                        &comments=Status changed by cypress automation script.`;

        return this.qaTouchApiCall('PATCH',endPoint,false)

    }

    /**
     * publishOne function 
     * 
     * the array of test results to QA Touch
     * @param   {*} results one test results onject. {case: string, status: string}
     * @param   {string} projectKey [optional] Qa touch project id
     * @param   {string} testRunKey array of test results. [{case: string, status: string}]
     * @returns <Promise> fullfills json response { success: boolean, msg: string }
     */
    publishOneResult(result, projectKey = this.options.projectKey, testRunKey = this.options.testRunId) {
        let endPoint = `testRunResults/status?status=${result.status}&project=${projectKey}
                        &test_run=${testRunKey}&run_result=${result.case}`

        return this.qaTouchApiCall('PATCH', endPoint, false)
    }

    /**
     * status config values
     *
     * @param status
     * @returns {number}
     */
    static statusConfig (status) {
        let statusId = 2;
        switch (status) {
            case 'Passed':
                statusId = 1;
                break;
            case 'Untested':
                statusId = 2;
                break;
            case 'Blocked':
                statusId = 3;
                break;
            case 'Retest':
                statusId = 4;
                break;
            case 'Failed':
                statusId = 5;
                break;
            case 'Not Applicable':
                statusId = 6;
                break;
            case 'In Progress':
                statusId = 7;
                break;
            default:
                statusId = 2
        }

        return statusId
    };

    /**
     * Title to case ids for qaTouch
     *
     * @param title
     * @returns {number[]}
     */
    static titleToCaseIds (title) {
        let caseIds = [];
        let testCaseIdRegExp = /\bTR(\d+)\b/g;
        let m;

        while ((m = testCaseIdRegExp.exec(title)) !== null) {
            let caseId = parseInt(m[1]);
            caseIds.push(caseId);
        }
        return caseIds;
    };

    /**
     * Title to case ids for qaTouch
     *
     * @param title
     * @returns {number[]}
     */
    static titleToCaseIds2 (title) {
        let testRegExp = /\bTR-?(\d+|[A-Za-z0-9]+)\b/g;
        let isNumRegExp = /^[0-9]+$/

        return [...testRegExp[Symbol.matchAll](title)].map(el => isNumRegExp.test(el[1]) ? parseInt(el[1]) : el[1]);
    };

    /**
     * make api calls to QA Touch
     *
     * @param {string} method the type of call: 'GET', 'PATCH' ...
     * @param {string} endpoint the api endpoint excluding the base url
     * @param {boolean} deepData [Optional] flag to determine if response.data or response.data.data should be returned. Default: true.
     * @returns < Promise > fulfills either api response.data or response.data.data
     */
    qaTouchApiCall(method, endpoint, deepData = true){
        return axios({
            method: method,
            url: this._url(endpoint),
            headers: {
                "api-token": this.options.apiToken,
                "domain": this.options.domain,
                "Content-Type": "application/json"
            },
        })
            .then(function (response) {
                return deepData ? response.data.data : response.data;
            })
            .catch(function (error) {
                return error;
            });
    }

}

module.exports = Qatouch;
