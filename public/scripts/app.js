var app = angular.module('cms', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'cms.controllers',
  'cms.directives',
  'cms.services',
  'cms.filters'
]);

// 单页面，路由控制
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('groupdetail',    { url: '/groupdetail/:id',  templateUrl: '../partials/groupdetail.html',    controller: 'groupdetailCtrl'})
      .state('userdetail',     { url: '/userdetail/:id',   templateUrl: '../partials/userdetail.html',      controller: 'userdetailCtrl'})
      .state('projectdetail',  { url: '/projectdetail/:id',templateUrl: '../partials/projectdetail.html',controller: 'projectdetailCtrl'})
      .state('feedback',       { url: '/feedback/:id&:name',templateUrl: '../partials/feedback.html',controller: 'feedbackCtrl'})
      .state('dashboard',      { url: '/dashboard',      templateUrl: '../partials/dashboard.html',      controller: 'dashboardCtrl'       })
      .state('myprofile',      { url: '/myprofile',      templateUrl: '../partials/myprofile.html',      controller: 'myprofileCtrl'       })
      .state('grademanage',    { url: '/grademanage',    templateUrl: '../partials/grademanage.html',    controller: 'grademanageCtrl'     })
      .state('grouplist',    { url: '/grouplist',    templateUrl: '../partials/grouplist.html',    controller: 'groupmanageCtrl'     })
      .state('classemanage',   { url: '/classemanage',   templateUrl: '../partials/classemanage.html',   controller: 'classemanageCtrl'    })
      .state('projectmanage',  { url: '/projectmanage',  templateUrl: '../partials/projectmanage.html',  controller: 'projectmanageCtrl'   })
      .state('passwordmodify', { url: '/passwordmodify', templateUrl: '../partials/passwordmodify.html', controller: 'passwordmodifyCtrl'  })
      .state('userslist',      { url: '/userslist',      templateUrl: '../partials/userslist.html',      controller: 'userslistCtrl'       })
      .state('usercreate',     { url: '/usercreate',     templateUrl: '../partials/usercreate.html',     controller: 'usercreateCtrl'      })
      .state('resumecheck',    { url: '/resumecheck',    templateUrl: '../partials/resumecheck.html',    controller: 'resumecheckCtrl'     })
      .state('broadcastlist',    { url: '/broadcastlist',    templateUrl: '../partials/broadcastlist.html',    controller: 'broadcastlistCtrl'     })
      .state('broadcastcreate',    { url: '/broadcastcreate',    templateUrl: '../partials/broadcastcreate.html',    controller: 'broadcastcreateCtrl'     })
      // .state('', { url: '/', templateUrl: '../partials/.html', controller: ''        })
      // .state('', { url: '/', tebroadcastcreatemplateUrl: '../partials/.html', controller: ''        })
      // .state('', { url: '/', templateUrl: '../partials/.html', controller: ''        })
      .state('mytasks',   { url: '/mytasks',   templateUrl: '../partials/mytasks.html',   controller: 'mytasksCtrl'          });
  }
]);

app.run(['$rootScope', function($rootScope) {
  $rootScope.$saferApply = function (exp) {
    if (!this.$$phase) {
      this.$apply(exp);
    } else {
      try {
        this.$eval(exp);
      } catch (ex) {
        $exceptionHandler(ex);
      } finally {
        this.$digest();
      }
    }
  };
}]);
