const bddCaseDef =
  'Feature : Testing the sub module\n' +
  '\tGiven a sub module\n' +
  '\tWhen we call the all module api\n' +
  '\tThen this module should pop up in the list\n';

const testCaseList = [
  {
    case_title: 'login',
    case_key: '9mB1r'
  },
  {
    case_title: 'login 2',
    case_key: 'qg2dP'
  },
  {
    case_title: 'Submod test',
    case_key: 'LqZ2J'
  },
  {
    case_title: 'Spotifyfollow',
    case_key: '7lVJX'
  },
  {
    case_title: 'test case 15',
    case_key: 'RMD3l'
  },
  {
    case_title: 'test case 14',
    case_key: 'd9mRW'
  },
  {
    case_title: 'Steps test case',
    case_key: 'n34kV'
  }
];

const dataToMerge = {
  projects: [
    {
      project_name: 'Mira test',
      project_key: 'vEyp',
      testRuns: [
        {
          testrun_name: 'Integration testing',
          testrun_key: 'g67W',
          results: [
            {
              run_key: 'p8Ra3',
              title: 'Submod test',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'LXn4J',
              title: 'Spotifyfollow',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'jpL1a',
              title: 'login',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: '48alw',
              title: 'login 2',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'vX98z',
              title: 'test case 15',
              status: 'Untested',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'b4WdR',
              title: 'test case 14',
              status: 'Untested',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'LmM1e',
              title: 'Steps test case',
              status: 'Untested',
              assigned_user: 'Laurent Burte  '
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'login',
          case_key: '9mB1r'
        },
        {
          case_title: 'login 2',
          case_key: 'qg2dP'
        },
        {
          case_title: 'Submod test',
          case_key: 'LqZ2J'
        },
        {
          case_title: 'Spotifyfollow',
          case_key: '7lVJX'
        },
        {
          case_title: 'test case 15',
          case_key: 'RMD3l'
        },
        {
          case_title: 'test case 14',
          case_key: 'd9mRW'
        },
        {
          case_title: 'Steps test case',
          case_key: 'n34kV'
        }
      ]
    },
    {
      project_name: 'Mira Demo',
      project_key: 'DyMZ',
      testRuns: [
        {
          testrun_name: 'All test case',
          testrun_key: 'dzjd',
          results: [
            {
              run_key: 'wRnDl',
              title: 'Sign up for Spotify presave campaign',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            },
            {
              run_key: 'LXdJW',
              title: 'Click the log out link',
              status: 'Failed',
              assigned_user: 'Laurent Burte  '
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'Click the log out link',
          case_key: 'LqjKJ'
        },
        {
          case_title: 'Sign up for Spotify presave campaign',
          case_key: '0jMXl'
        }
      ]
    }
  ]
};

const mergedData = {
  projects: [
    {
      project_name: 'Mira test',
      project_key: 'vEyp',
      testRuns: [
        {
          testrun_name: 'Integration testing',
          testrun_key: 'g67W',
          results: [
            {
              run_key: 'p8Ra3',
              title: 'Submod test',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'LqZ2J'
            },
            {
              run_key: 'LXn4J',
              title: 'Spotifyfollow',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '7lVJX'
            },
            {
              run_key: 'jpL1a',
              title: 'login',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '9mB1r'
            },
            {
              run_key: '48alw',
              title: 'login 2',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'qg2dP'
            },
            {
              run_key: 'vX98z',
              title: 'test case 15',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'RMD3l'
            },
            {
              run_key: 'b4WdR',
              title: 'test case 14',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'd9mRW'
            },
            {
              run_key: 'LmM1e',
              title: 'Steps test case',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'n34kV'
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'login',
          case_key: '9mB1r'
        },
        {
          case_title: 'login 2',
          case_key: 'qg2dP'
        },
        {
          case_title: 'Submod test',
          case_key: 'LqZ2J'
        },
        {
          case_title: 'Spotifyfollow',
          case_key: '7lVJX'
        },
        {
          case_title: 'test case 15',
          case_key: 'RMD3l'
        },
        {
          case_title: 'test case 14',
          case_key: 'd9mRW'
        },
        {
          case_title: 'Steps test case',
          case_key: 'n34kV'
        }
      ]
    },
    {
      project_name: 'Mira Demo',
      project_key: 'DyMZ',
      testRuns: [
        {
          testrun_name: 'All test case',
          testrun_key: 'dzjd',
          results: [
            {
              run_key: 'wRnDl',
              title: 'Sign up for Spotify presave campaign',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '0jMXl'
            },
            {
              run_key: 'LXdJW',
              title: 'Click the log out link',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'LqjKJ'
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'Click the log out link',
          case_key: 'LqjKJ'
        },
        {
          case_title: 'Sign up for Spotify presave campaign',
          case_key: '0jMXl'
        }
      ]
    }
  ]
};

const DLdata = {
  projects: [
    {
      project_name: 'Mira test',
      project_key: 'vEyp',
      testRuns: [
        {
          testrun_name: 'Integration testing',
          testrun_key: 'g67W',
          results: [
            {
              run_key: 'p8Ra3',
              title: 'Submod test',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'LqZ2J',
              caseSteps:
                'Feature : Testing the sub module\n\tGiven a sub module\n\tWhen we call the all module api\n\tThen this module should pop up in the list\n'
            },
            {
              run_key: 'LXn4J',
              title: 'Spotifyfollow',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '7lVJX',
              caseSteps:
                'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\nScenario : Trying the re-usable script\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\n'
            },
            {
              run_key: 'jpL1a',
              title: 'login',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '9mB1r',
              caseSteps:
                'Feature : Sign in to mira dev\nScenario : SC01 Sign in with a valid username and password\n\tGiven The user visit the mira dev log in page\n\tAnd types in a username and password\n\tWhen the user clicks on the sign in button\n\tThen the user should land on campaign page\n'
            },
            {
              run_key: '48alw',
              title: 'login 2',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'qg2dP',
              caseSteps:
                'Feature : Sign in to mira dev\nScenario : SC01 Sign in with a valid username and password\n\tGiven The user visit the mira dev log in page\n\tAnd types in a username and password\n\tWhen the user clicks on the sign in button\n\tThen the user should land on campaign page\n'
            },
            {
              run_key: 'vX98z',
              title: 'test case 15',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'RMD3l',
              caseSteps:
                'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\nScenario : Trying the re-usable script\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\n'
            },
            {
              run_key: 'b4WdR',
              title: 'test case 14',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'd9mRW',
              caseSteps:
                'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\nScenario : Trying the re-usable script\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\n'
            },
            {
              run_key: 'LmM1e',
              title: 'Steps test case',
              status: 'Untested',
              assigned_user: 'Laurent Burte  ',
              case_key: 'n34kV',
              caseSteps: ''
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'login',
          case_key: '9mB1r'
        },
        {
          case_title: 'login 2',
          case_key: 'qg2dP'
        },
        {
          case_title: 'Submod test',
          case_key: 'LqZ2J'
        },
        {
          case_title: 'Spotifyfollow',
          case_key: '7lVJX'
        },
        {
          case_title: 'test case 15',
          case_key: 'RMD3l'
        },
        {
          case_title: 'test case 14',
          case_key: 'd9mRW'
        },
        {
          case_title: 'Steps test case',
          case_key: 'n34kV'
        }
      ]
    },
    {
      project_name: 'Mira Demo',
      project_key: 'DyMZ',
      testRuns: [
        {
          testrun_name: 'All test case',
          testrun_key: 'dzjd',
          results: [
            {
              run_key: 'wRnDl',
              title: 'Sign up for Spotify presave campaign',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: '0jMXl',
              caseSteps:
                "Feature :     Prompt fan to sign up with his / her Spotify account  \nScenario : Prompt fan to sign up with his / her Spotify account\n\tGiven a campaign with Spotify presave action\n\tWhen fan clicks the Sportify presave action button\n\tThen  user is prompted to log in with his / her Spotify credentials\nScenario : Fan signs up for campaign's Spotify presave\n\tGiven  a fan is prompted to log in with his / her Spotify credentials\n\tAnd credentials are entered\n\tWhen connect button is clicked\n\tThen fan should see thank you page\n"
            },
            {
              run_key: 'LXdJW',
              title: 'Click the log out link',
              status: 'Failed',
              assigned_user: 'Laurent Burte  ',
              case_key: 'LqjKJ',
              caseSteps:
                'Feature : Click the log out link\n\tGiven user is logged in\n\tAnd is using Mira Editor\n\tWhen he /she clicks the log out link\n\tThen user should be logout and redirected to login page\n'
            }
          ]
        }
      ],
      testCases: [
        {
          case_title: 'Click the log out link',
          case_key: 'LqjKJ'
        },
        {
          case_title: 'Sign up for Spotify presave campaign',
          case_key: '0jMXl'
        }
      ]
    }
  ]
};

const refTemplate = [
  'Feature: Submod test\n' + // BDD template
    '\tScenario: TR-p8Ra3 Submod test\n' +
    '\t\tGiven\n' +
    '\t\tWhen\n' +
    '\t\tThen\n',
  'describe("__", () => {\n' + // template
    '\tit("TR-p8Ra3 Submod test", () => {\n' +
    '\t\t//write test case final assertion here\n' +
    '\t})\n' +
    '})\n'
];

const dlElements = [
  {
    run_key: 'p8Ra3',
    title: 'Submod test',
    status: 'Failed',
    assigned_user: 'Laurent Burte  ',
    case_key: 'LqZ2J',
    caseSteps:
      'Feature : Testing the sub module\n\tGiven a sub module\n\tWhen we call the all module api\n\tThen this module should pop up in the list\n'
  },
  {
    run_key: 'LXn4J',
    title: 'Spotifyfollow',
    status: 'Failed',
    assigned_user: 'Laurent Burte  ',
    case_key: '7lVJX',
    caseSteps:
      'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\nScenario : Trying the re-usable script\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\n'
  },
  {
    run_key: 'jpL1a',
    title: 'login',
    status: 'Failed',
    assigned_user: 'Laurent Burte  ',
    case_key: '9mB1r',
    caseSteps:
      'Feature : Sign in to mira dev\nScenario : SC01 Sign in with a valid username and password\n\tGiven The user visit the mira dev log in page\n\tAnd types in a username and password\n\tWhen the user clicks on the sign in button\n\tThen the user should land on campaign page\n'
  },
  {
    run_key: 'vX98z',
    title: 'test case 15',
    status: 'Untested',
    assigned_user: 'Laurent Burte  ',
    case_key: 'RMD3l',
    caseSteps:
      'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\n'
  },
  {
    run_key: 'ed99z',
    title: 'test case 147',
    status: 'Untested',
    assigned_user: 'Laurent Burte  ',
    case_key: 'AMD37',
    caseSteps:
      'Feature : Some important feature name\n\tBackground the background of this re-usable feature is amazing\n\tGiven Given a new tool like QA touch\n\tWhen I create a new re-usable script\n\tThen I should be able to understand how this work\nScenario : SC01 Sign in with a valid username and password\n\tGiven The user visit the mira dev log in page\n\tAnd types in a username and password\n\tWhen the user clicks on the sign in button\n\tThen the user should land on campaign page\n'
  },
  {
    run_key: 'LmM1e',
    title: 'Steps test case',
    status: 'Untested',
    assigned_user: 'Laurent Burte  ',
    case_key: 'n34kV',
    caseSteps: ''
  }
];

const refDL = [
  '# Test case key: LqZ2J\n\n' +
    'Feature: Testing the sub module\n' +
    '\tScenario: TR-p8Ra3 Submod test\n' +
    '\t\tGiven a sub module\n' +
    '\t\tWhen we call the all module api\n' +
    '\t\tThen this module should pop up in the list\n',
  '# Test case key: 7lVJX\n\n' +
    'Feature: Some important feature name\n' +
    '\tBackground: the background of this re-usable feature is amazing\n' +
    '\tScenario: TR-LXn4J Trying the re-usable script\n' +
    '\t\tGiven Given a new tool like QA touch\n' +
    '\t\tWhen I create a new re-usable script\n' +
    '\t\tThen I should be able to understand how this work\n',
  '# Test case key: 9mB1r\n\n' +
    'Feature: Sign in to mira dev\n' +
    '\tScenario: TR-jpL1a SC01 Sign in with a valid username and password\n' +
    '\t\tGiven The user visit the mira dev log in page\n' +
    '\t\tAnd types in a username and password\n' +
    '\t\tWhen the user clicks on the sign in button\n' +
    '\t\tThen the user should land on campaign page\n',
  '# Test case key: RMD3l\n\n' +
    'Feature: Some important feature name\n' +
    '\tBackground: the background of this re-usable feature is amazing\n' +
    '\tScenario: TR-vX98z test case 15\n' +
    '\t\tGiven Given a new tool like QA touch\n' +
    '\t\tWhen I create a new re-usable script\n' +
    '\t\tThen I should be able to understand how this work\n',
  '# Test case key: AMD37\n\n' +
    'Feature: Some important feature name\n' +
    '\tBackground: the background of this re-usable feature is amazing\n' +
    '\tScenario: TR-ed99z test case 147\n' +
    '\t\tGiven Given a new tool like QA touch\n' +
    '\t\tWhen I create a new re-usable script\n' +
    '\t\tThen I should be able to understand how this work\n' +
    '\tScenario: TR-ed99z SC01 Sign in with a valid username and password\n' +
    '\t\tGiven The user visit the mira dev log in page\n' +
    '\t\tAnd types in a username and password\n' +
    '\t\tWhen the user clicks on the sign in button\n' +
    '\t\tThen the user should land on campaign page\n',
  'Feature: Steps test case\n' +
    '\tScenario: TR-LmM1e Steps test case\n' +
    '\t\tGiven\n' +
    '\t\tWhen\n' +
    '\t\tThen\n'
];

const levels = [
  {
    array: 'projects',
    name: 'project_name',
    keyId: ' P-',
    key: 'project_key',
    type: 'folder'
  },
  {
    array: 'testRuns',
    name: 'testrun_name',
    keyId: ' R-',
    key: 'testrun_key',
    type: 'folder'
  },
  {
    array: 'results',
    name: 'title',
    keyId: 'TR-',
    key: 'run_key',
    steps: 'caseSteps',
    caseId: 'case_key',
    type: 'file'
  }
];

module.exports = {
  project: 'vEyp',
  testRunId: '',
  bddCaseId: 'd9mRW',
  stepCaseId: 'n34kV',
  testCaseList,
  bddCaseDef,
  dataToMerge,
  mergedData,
  DLdata,
  levels,
  refTemplate,
  dlElements,
  refDL
};
