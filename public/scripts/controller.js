angular.module('cms.controllers', [])

//
//== 应用
  .controller('appCtrl', [
    '$cookies',
    '$scope',
    'Users',
    'Broadcasts',
    'Feedbacks',
  function($cookies, $scope, Users, Broadcasts, Feedbacks) {
    var userid = $cookies['_id'];

    Users.one({ user_id: userid }).$promise.then(function(data) {
      $scope.user = data.data.user;
      $scope.menus = data.data.menus;
      $scope.alerts = data.data.user.feedbacks;

      Broadcasts.all().$promise.then(function(data) {
        $scope.broadcasts = _.slice(data.broadcasts, 0, 6);
      });
    });

    $scope.showMenu = function(){
      $('.page-sidebar').toggleClass('open');
    }

    $scope.closeAlert = function(index,id) {
      $scope.alerts.splice(index, 1);
      // feedback、user删除
      var user = {
        user_id: userid
      };
      user.feedbacks = _.pluck($scope.alerts, '_id');
      Users.update(user);
      Feedbacks.delete({feedback_id: id});
    };
  }])

//
//== 头部
  .controller('headerCtrl', ['$scope', function($scope) {

  }])

//
//== 侧边栏
  .controller('sidebarCtrl', ['$scope', function($scope) {

  }])

//
//== 仪表盘
  .controller('dashboardCtrl', ['$scope', function($scope) {

  }])


//
//== 年级管理
  .controller('grademanageCtrl', ['$scope', function($scope) {

  }])


//
//== 小组管理
  .controller('groupmanageCtrl', ['$scope', 'Groups', 'Users', function($scope, Groups, Users) {

    $scope.status = 'normal';
    $scope._id = '';

    // 定义scope
    Users.all().$promise.then(function(data) {
      if (data.status !== 1) return alert('发生错误!');
      $scope.users = data.data.users;
    });

    Groups.all().$promise.then(function(data) {
      if (data.status !== 1) return alert('发生错误!');
      $scope.groups = data.data.groups || [];
    });

    // 定义方法
    var updateForm = function(name, leader, description, isopen, begintime) {
      $scope.groupname        = name        || '';
      $scope.groupleader      = leader      || '';
      $scope.groupdescription = description || '';
      $scope.groupisopen      = isopen      || false;
      $scope.groupbegintime   = begintime   || '';
    };

    // 事件定义
    $scope.$on('2dertgaddGroup', function() {
      var newGroup = {
        name        : $scope.groupname,
        leader      : $scope.groupleader,
        description : $scope.groupdescription,
        isopen      : $scope.groupisopen,
        begintime   : $scope.groupbegintime
      };
      if (!newGroup.name) { return alert('名称不能为空'); }
      Groups.save(newGroup).$promise.then(function(data) {
        if (data.status !== 1) return alert(data.msg || '发生错误!');
        $scope.groups.unshift(data.data.group);
        updateForm();
      });
    });

    $scope.$on('goUpdateGroup', function(e, group) {
      $scope._id = group._id;
      updateForm(group.name, group.leader, group.description, group.isOpen, group.beginTime);
      $scope.status = 'update';
      $scope.$saferApply();
    });

    $scope.$on('updateGroup', function(e, id) {
      var updateGroup = {
        group_id    : $scope._id,
        name        : $scope.groupname,
        leader      : $scope.groupleader,
        description : $scope.groupdescription,
        isopen      : $scope.groupisopen,
        begintime   : $scope.groupbegintime
      };
      Groups.update(updateGroup).$promise.then(function(data) {
        if (data.status !== 1) return alert(data.msg || '发生错误');
        alert(data.msg);
        Groups.all().$promise.then(function(data) {
          if (data.status !== 1) return alert('发生错误!');
          $scope.groups = data.data.groups || [];
        });
      });
      // $scope.$saferApply();
    });

    $scope.$on('deleteGroup', function(e, group) {
      Groups.delete({ group_id: group._id}).$promise.then(function(data) {
        if (data.status !== 1) return alert(data.msg || '发生错误');
        Groups.all().$promise.then(function(data) {
          if (data.status !== 1) return alert('发生错误!');
          $scope.groups = data.data.groups || [];
        });
      });
    });
  }])

// 
// == 小组信息
  .controller('groupdetailCtrl', ['$scope', 'Groups', 'Roles', '$stateParams', function($scope, Groups, Roles, $stateParams) {
    $scope.isEdit = false;
    $scope.oper = '编辑';
    $scope.selectedStaff = null;

    Groups.one({ group_id: $stateParams.id }).$promise.then(function(data){
      $scope.info = data.group;
    });

    Roles.one({role_num: '01'}).$promise.then(function(data){
      $scope.allLeaders = data.users;   
    });

    $scope.$on('showModal', function() {
      Roles.one({role_num: '10'}).$promise.then(function(data){
        $scope.allStaffs = data.users; 
      });
      $scope.$saferApply();
    });

    $scope.$on('revokeEdit', function() {
      $scope.isEdit = false;
      Groups.one({ group_id: $stateParams.id }).$promise.then(function(data){
        $scope.info = data.group;
        $scope.oper = '编辑';
      });
      $scope.errorMsg = '';
      $scope.$saferApply();
    }); 

    $scope.$on('addTag', function() {
      var length = $scope.info.currentStaffs.length;
      if($scope.selectedStaff) {
        var selectedStaff = $scope.selectedStaff.split('/');
        $scope.selectedStaff = {_id: Number(selectedStaff[0]), username: selectedStaff[1]};
        $scope.info.currentStaffs[length] = $scope.selectedStaff;
      }
      $('#myModal').hide();
      $scope.$saferApply();
    });

    $scope.$on('deleteTag', function(event,data) {
      data = Number(data);
      _.remove($scope.info.currentStaffs, function(staff) {
        return staff._id == data;
      });
      $scope.$saferApply();
    });
    
    $scope.$on('goInfoEdit', function() {
      $scope.isEdit = true;
      $scope.oper = '确认更新';
      $scope.$saferApply();
    });

    $scope.$on('goUpdate', function(){
      if(!$scope.info.name) {
        $scope.errorMsg = '组名不能为空';
        $scope.$saferApply();
        return;
      }
      var updateGroup = {
        group_id        : $stateParams.id,
        name            : $scope.info.name,
        isOpen          : $scope.info.isOpen || '',
        currentLeader   : Number($scope.info.currentLeader._id) || '',
        description     : $scope.info.description || ''
      };
      updateGroup.currentStaffs = _.pluck($scope.info.currentStaffs, '_id');
      Groups.update(updateGroup).$promise.then(function(data) {
        if (data.status !== 1) return $scope.errorMsg = data.msg;
        Groups.one({ group_id: $stateParams.id }).$promise.then(function(data){
          $scope.info = data.group;
        });
        $('#operationBtn').removeClass('btn-warning').addClass('btn-primary');
        $scope.oper = '编辑';
        $scope.isEdit = false;
        alert(data.msg);
      });
      $scope.$saferApply();
    });
  }])

//
//== 班级管理
  .controller('classemanageCtrl', ['$scope', 'Classes', function($scope, Classes) {
    // scope 初始化
    $scope.isVisible = true;

    Classes.all().$promise.then(function(data) {
      if (data.status !== 1) return alert('发生错误!');
      $scope.classes = data.data.classes;
    });

    // 添加班级
    $scope.$on('addClasse', function() {
      var name, alias, isopen, classe = {};
      name = $scope.classename || '';
      alias = $scope.classealias || '';
      isopen = $scope.isopen || false;

      if (!name) return alert('班级名称不能为空');
      classe.name = name;
      classe.alias = alias;
      classe.isopen = isopen;

      Classes.save(classe).$promise.then(function(data) {
        $scope.classes.push(data.data.classe);
        $scope.classename = '';
        $scope.classealias = '';
        $scope.isopen = false;
      });
    });

    // 删除班级
    $scope.$on('deleteClasse', function(e, id) {
      if (!id) return;
      Classes.delete({ classe_id: id }).$promise.then(function(data) {
        Classes.all().$promise.then(function(data) {
          if (data.status !== 1) return alert('发生错误!');
          $scope.classes = data.data.classes;
        });
      });
    });

    // go 修改班级
    $scope.$on('goModifyClasse', function(e, classe) {
      if (!classe) return;
      $scope.classeid = classe._id;
      $scope.classename = classe.name;
      $scope.classealias = classe.alias;
      $scope.isopen = classe.isOpen;

      $scope.isVisible = false;
      $scope.$saferApply();
    });

    // 修改班级
    $scope.$on('modifyClasse', function(e) {
      var classe = {};

      classe.classe_id = $scope.classeid || '';
      classe.name = $scope.classename || '';
      classe.alias = $scope.classealias || '';
      classe.isopen = $scope.isopen || false;


      Classes.update(classe).$promise.then(function() {
        $scope.isVisible = true;
        $scope.classename = '';
        $scope.classealias = '';
        $scope.isopen = false
        Classes.all().$promise.then(function(data) {
          if (data.status !== 1) return alert('发生错误!');
          $scope.classes = data.data.classes;
        });
      });
    });

    // 撤销班级修改
    $scope.$on('revokeModifyClasse', function() {
      $scope.isVisible = true;
      $scope.classename = '';
      $scope.classealias = '';
      $scope.isopen = false
      $scope.$saferApply();
    });
  }])

//
//== 项目管理
  .controller('projectmanageCtrl', ['$scope', function($scope) {

  }])
// 
// == 项目信息
  .controller('projectdetailCtrl', ['$scope', 'Projects', '$stateParams', function($scope, Projects, $stateParams) {
    $scope.isEdit = false;
    $scope.oper = '编辑';
    $scope.id = $stateParams.id;
    var proState = '';

    Projects.one({ project_id: $stateParams.id }).$promise.then(function(data){
      $scope.info = data.project;
      proState = data.project.status;
    });

    $scope.$on('revokeEdit', function() {
      $scope.isEdit = false;
      Projects.one({ project_id: $stateParams.id }).$promise.then(function(data){
        $scope.info = data.project;
        $scope.oper = '编辑';
      });
      $scope.errorMsg = '';
      $scope.$saferApply();
    }); 
    
    $scope.$on('goInfoEdit', function() {
      $scope.isEdit = true;
      $scope.oper = '确认更新';
      $scope.$saferApply();
    });

    $scope.$on('goUpdate', function(){
      if(!$scope.info.name) {
        $scope.errorMsg = '项目名不能为空';
        $scope.$saferApply();
        return;
      }
      var updateProject = {
        project_id        : $stateParams.id,
        name              : $scope.info.name,
        description       : $scope.info.description || '',
        group             : $scope.info.group._id
      };
      if(proState == '未分配' && $scope.info.group) updateProject.status == '已分配';
      if(proState == '已分配' && !$scope.info.group) updateProject.status == '未分配';
      Projects.update(updateProject).$promise.then(function(data) {
        if (data.status !== 1) return $scope.errorMsg = data.msg;
        Projects.one({ project_id: $stateParams.id }).$promise.then(function(data){
          $scope.info = data.project;
        });
        $scope.oper = '编辑';
        $scope.isEdit = false;
        alert(data.msg);
      });
      $scope.$saferApply();
    });
  }])


// 
// == 用户信息
  .controller('userdetailCtrl', ['$scope', 'Users', '$stateParams', function($scope, Users, $stateParams) {
    $scope.isEdit = false;
    $scope.oper = '编辑';

    Users.one({ user_id: $stateParams.id }).$promise.then(function(data) {
      $scope.info = data.data.user;
    });

    $scope.$on('revokeEdit', function() {
      $scope.isEdit = false;
      Users.one({ user_id: $stateParams.id }).$promise.then(function(data){
        $scope.info = data.data.user;
        $scope.oper = '编辑';
      });
      $scope.errorMsg = '';
      $scope.$saferApply();
    }); 
    
    $scope.$on('goInfoEdit', function() {
      $scope.isEdit = true;
      $scope.oper = '确认更新';
      $scope.$saferApply();
    });

    $scope.$on('goUpdate', function(){
      if(!$scope.info.username){
        $scope.errorMsg = '姓名不能为空！';
        $scope.$saferApply();
        return;
      }
      if($scope.info.status == 'true' && !$scope.info.account){
        $scope.errorMsg = '在职人员帐号不能为空！';
        $scope.$saferApply();
        return;
      }
      var user = {
        user_id: $stateParams.id,
        username: $scope.info.username,
        account: $scope.info.account || '',
        status: $scope.info.status,
        role: $scope.info.role.number,
        phone: $scope.info.phone || '',
        birthday: $scope.info.birthday || '',
        introduction: $scope.info.introduction || ''
      };
      Users.update(user).$promise.then(function(data) {
        if (data.status == 1){
          Users.one({ user_id: $stateParams.id }).$promise.then(function(data) {
            $scope.info = data.data.user;
          });
          $scope.oper = '编辑';
          $('#operationBtn').removeClass('btn-warning').addClass('btn-primary');
          $scope.isEdit = false;
          alert(data.msg);
        }else {
          $scope.errorMsg = data.msg;
        }
      });
      $scope.$saferApply();
    });
  }])

//
//== 成员列表
  .controller('userslistCtrl', ['$scope', 'Users', 'Roles',  function($scope, Users, Roles) {
    Users.all().$promise.then(function(data) {
      $scope.users = data.data.users;
    });

    $scope.changeQuery = function() {
      if($scope.query) {
        Roles.one({role_num: $scope.query}).$promise.then(function(data){
          $scope.users = data.users;   
        });
      } else {
        Users.all().$promise.then(function(data) {
          $scope.users = data.data.users;
        });
      }
    };
  }])

//
//== 新增成员
  .controller('usercreateCtrl', ['$scope', 'Groups', 'Users', function($scope, Groups, Users) {
    // 定义scope
    $scope.roles = ['00','01','10','11'];
    Groups.all().$promise.then(function(data) {
      if (data.status !== 1) return alert('发生错误!');
      $scope.groups = _.remove(data.data.groups, function(group){ return group.isOpen == 'true'});
      $scope.selectedGroups = [$scope.groups[0]._id];
      $scope.belongGroup = [$scope.groups[0]._id];
    });

    $scope.role = '00';

    $scope.addUserMsg = '';

    // 方法
    $scope.togglebelongGroup = function(role) {
      $scope.belongGroup = [role];
    };

    $scope.toggleselectedGroups = function(role) {
      var idx = $scope.selectedGroups.indexOf(role);
      if (idx > -1) { $scope.selectedGroups.splice(idx, 1); }
      else { $scope.selectedGroups.push(role) }
    };

    // 添加用户
    $scope.$on('addUser', function(e) {
      var user = {};
      user.account = $scope.useraccount;
      user.password = $scope.userpassword || '123';
      user.birthday = $scope.userbirthday || '';
      user.phone = $scope.userphone || '';
      user.role = $scope.role;
      if(user.role == '10') user.currentGroup = $scope.selectedGroups || [];
      if(user.role == '01') user.currentGroup = $scope.belongGroup || [];
      user.username = $scope.username || '佚名';

      if (!user.account) {
        $scope.addUserMsg = '登录账号不能为空!';
        $scope.$saferApply();
        return;
      }
      if (!$scope.role) {
        $scope.addUserMsg = '请选择成员担任角色!';
        $scope.$saferApply();
        return;
      }
      Users.save(user).$promise.then(function(data) {
        if (data.status !== 1) $scope.addUserMsg = data.msg;
        $scope.useraccount = '';
        $scope.userpassword = '';
        $scope.userbirthday = '';
        $scope.userphone = '';
        $scope.username = '';
        $scope.selectedGroups = [$scope.groups[0]._id];
        $scope.belongGroup = [$scope.groups[0]._id];
        $scope.role = '00';
        $scope.addUserMsg = data.msg;
      });
    });
  }])

//
//== 简历审核
  .controller('resumecheckCtrl', ['$scope', function($scope) {

  }])

//
//== 我的信息
  .controller('myprofileCtrl', ['$scope', '$cookies', 'Users', function($scope, $cookies, Users) {
    // 定义scope
    var userid = $cookies['_id'];

    $scope.normal = true;
    
    Users.one({ user_id: userid }).$promise.then(function(data) {
      $scope.info = data.data.user;
    });

    // 前往编辑
    $scope.$on('goInfoEdit', function() {
      $scope.normal = false;
      $scope.$saferApply();
    });
    // 取消编辑
    $scope.$on('revokeEdit', function() {
      $scope.normal = true;
      $scope.addUserMsg = '';
      Users.one({ user_id: userid }).$promise.then(function(data) {
        $scope.info = data.data.user;
      });
      $scope.$saferApply();
    });
    // 更新编辑
    $scope.$on('updateEdit', function() {
      if(!$scope.info.username || $scope.info.username == ''){
        $scope.addUserMsg = '姓名不能为空';
        $scope.$saferApply();
        return;
      }else{
        var user = {
          user_id: $scope.info.id,
          username: $scope.info.username,
          phone: $scope.info.phone || '',
          birthday: $scope.info.birthday || '',
          introduction: $scope.info.introduction || ''
        };
        Users.update(user).$promise.then(function(data) {
          if (data.status == 1){
            location.reload() 
          }else {
            $scope.addUserMsg = data.msg;
          }
        });
      }
    });
  }])

// 
// == 公告
  .controller('broadcastcreateCtrl', ['$scope', '$cookies', 'Broadcasts', function($scope, $cookies, Broadcasts) {
    $scope.description = '';
    $scope.$on('submitBroadcast', function() {
      if(!$scope.description) {
        alert('发布的内容不能为空！');
        return;
      }
      var userid = $cookies['_id'],
          condition = {
            description: $scope.description,
            creator: userid
          };
      Broadcasts.save(condition).$promise.then(function(data){
        alert(data.msg);
        if(data.status == 1) {
          $scope.description = '';
        }
      });
    });
  }])

  .controller('broadcastlistCtrl', ['$scope', 'Broadcasts', function($scope, Broadcasts) {
    Broadcasts.all().$promise.then(function(data) {
      $scope.info = data.broadcasts;
    });
    $scope.$on('deleteDoc', function(event, data) {
      var condition = {broadcast_id: data};
      Broadcasts.delete(condition).$promise.then(function(data){
        alert(data.msg);
        if(data.status == 1) {
          Broadcasts.all().$promise.then(function(data) {
            $scope.info = data.broadcasts;
          });
        }
      });
    });
  }])

//
//== 任务管理
  .controller('mytasksCtrl', ['$scope', function($scope) {

  }])

//
//== 密码修改
  .controller('passwordmodifyCtrl', ['$scope', function($scope) {

  }]);

