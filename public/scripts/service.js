angular.module('cms.services', [])

//
//== 用户
  .factory('Users', ['$resource', function($resource) {
    'use strict';
    var Users = $resource('/users', null, {
      'all':     { method: 'GET',    url: '/users' },
      'save':    { method: 'POST',   url: '/users' },
      'one':     { method: 'GET',    url: '/users/:user_id',         params: { user_id: '@user_id' } },
      'update':  { method: 'PUT',    url: '/users/:user_id',         params: { user_id: '@user_id' } },
      'delete':  { method: 'DELETE', url: '/users/:user_id',         params: { user_id: '@user_id' } },
      'allInfo': { method: 'GET',    url: '/users/:user_id/allinfo', params: { user_id: '@user_id' } }
    });
    return Users;
  }])

//
//== 年级
  .factory('Grades', ['$resource', function($resource) {
    'use strict';
    var Grades = $resource('/grades', null, {
      'all':    { method: 'GET',    url: '/grades' },
      'save':   { method: 'POST',   url: '/grades' },
      'delete': { method: 'DELETE', url: '/grades/:grade_id', params: { grade_id: '@grade_id' } },
    });
    return Grades;
  }])

// == 角色
  .factory('Roles', ['$resource', function($resource) {
    'use strict';
    var Roles = $resource('/roles', null, {
      'one':    { method: 'GET',    url: '/roles/:role_num', params: { role_num: '@role_num' } }
    });
    return Roles;
  }])

//
//== 反馈
  .factory('Feedbacks', ['$resource', function($resource) {
    'use strict';
    var Feedbacks = $resource('/feedbacks', null, {
      'all':    { method: 'GET',    url: '/feedbacks' },
      'save':   { method: 'POST',   url: '/feedbacks' },
      'one':    { method: 'GET',    url: '/feedbacks/:feedback_id', params: { feedback_id: '@feedback_id' } },
      'delete': { method: 'DELETE', url: '/feedbacks/:feedback_id', params: { feedback_id: '@feedback_id' } },
    });
    return Feedbacks;
  }])

//
//== 公告
  .factory('Broadcasts', ['$resource', function($resource) {
    'use strict';
    var Broadcasts = $resource('/broadcasts', null, {
      'all':    { method: 'GET',    url: '/broadcasts' },
      'save':   { method: 'POST',   url: '/broadcasts' },
      'one':    { method: 'GET',    url: '/broadcasts/:broadcast_id', params: { broadcast_id: '@broadcast_id' } },
      'delete': { method: 'DELETE', url: '/broadcasts/:broadcast_id', params: { broadcast_id: '@broadcast_id' } },
    });
    return Broadcasts;
  }])


//
//== 小组
  .factory('Groups', ['$resource', function($resource) {
    'use strict';
    var Groups = $resource('/groups', null, {
      'all':    { method: 'GET',    url: '/groups' },
      'save':   { method: 'POST',   url: '/groups' },
      'one':    { method: 'GET',    url: '/groups/:group_id', params: { group_id: '@group_id' } },
      'update': { method: 'PUT',    url: '/groups/:group_id', params: { group_id: '@group_id' } },
      'delete': { method: 'DELETE', url: '/groups/:group_id', params: { group_id: '@group_id' } },
    });
    return Groups;
  }])

//
//== 项目
  .factory('Projects', ['$resource', function($resource) {
    'use strict';
    var Projects = $resource('/projects', null, {
      'all':    { method: 'GET',    url: '/projects' },
      'save':   { method: 'POST',   url: '/projects' },
      'one':    { method: 'GET',    url: '/projects/:project_id', params: { project_id: '@project_id' } },
      'update': { method: 'PUT',    url: '/projects/:project_id', params: { project_id: '@project_id' } },
      'delete': { method: 'DELETE', url: '/projects/:project_id', params: { project_id: '@project_id' } },
    });
    return Projects;
  }]);
