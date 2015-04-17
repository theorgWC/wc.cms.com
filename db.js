//
//== 模块依赖
var mongoose      = require('mongoose');

var Sequence      = require('./models/Sequence');
// var Classe        = require('./models/Classe');
// var Grade         = require('./models/Grade');
var Group         = require('./models/Group');
var User          = require('./models/User');


//
//== 引入控制器
var builder = require('./controllers/builder');


//
//== 连接mongo数据库
mongoose.connect('mongodb://localhost/cms');


//
//== 定义变量
var flag = false, len, tmp, i, db;

db = mongoose.connection;

/*自动增长*/
var buildSequences = function() {
  new Sequence({ _id: 'users'     }).save();
  new Sequence({ _id: 'tasks'     }).save();
  new Sequence({ _id: 'groups'    }).save();
  new Sequence({ _id: 'projects'  }).save();
  new Sequence({ _id: 'resumes'  }).save();
  new Sequence({ _id: 'broadcasts'  }).save();
  new Sequence({ _id: 'feedbacks' }).save();
  console.log('###### generate sequence');
};

/*生成管理员*/
var buildAdmin = function() {
  builder.getNextSequence('users', function(seq) {
    var admin = new User({
      _id: seq,
      account: 'admin@wc.com',
      username: 'administrator',
      role: '00',
      introduction: 'administrator has the top privilege'
    });
    admin.save(function() {
      console.log('###### generate the new administrator: admin');
    });
  });
};

var buildLeader = function() {
  builder.getNextSequence('users', function(seq) {
    var admin = new User({
      _id: seq,
      account: 'leader@wc.com',
      username: 'group leader',
      role: '01',
      introduction: 'group leader is responsible for his group'
    });
    admin.save(function() {
      console.log('###### generate the new leader: group leader');
    });
  });
};

var buildMember = function() {
  builder.getNextSequence('users', function(seq) {
    var admin = new User({
      _id: seq,
      account: 'member@wc.com',
      username: 'member',
      role: '10',
      introduction: 'member is the general member in the team'
    });
    admin.save(function() {
      console.log('###### generate the new member: member');
    });
  });
};

var buildProposor = function() {
  builder.getNextSequence('users', function(seq) {
    var admin = new User({
      _id: seq,
      account: 'proposor',
      username: 'proposor',
      role: '11',
      introduction: 'the proposor is the man who want to be employed'
    });
    admin.save(function() {
      console.log('###### generate the new proposor: proposor');
    });
  });
};

// Create Auto-Incrementing Sequence Field
// var callback = function() {
//   var Sequences = db.collections.sequences;
//   if (Sequences) {
//     Sequences.drop(function() {
//       console.log('###### drop collection sequences in db');
//       buildSequences();
//     });
//   } else {
//     buildSequencess();
//   };
// };

//
//== 生成小组
var buildGroup = function() {
  new Group({_id: 1, name: '前端组'}).save();
  new Group({_id: 2, name: '安卓组'}).save();
  new Group({_id: 3, name: '游戏组'}).save();
  new Group({_id: 4, name: '动画组'}).save();
  builder.setCurrentSequence('groups', 4, function(err){
    if(err) {
      console.log('build error whild build group')
    } else {
      console.log('generate four groups');
    }
  });
};


//
// == 生成管理员
// var callback = function() {
//   var conditions = { role: '01000000' };
//   User.find(conditions, function(err, users) {
//     if (users.length !== 0) {
//       User.remove(conditions, function() {
//         console.log('###### delete admin already exist in db');
//         buildAdmin();
//       });
//       return;
//     }
//     buildAdmin();
//   });
// };

// == 初始化填充数据
var init = function() {
  db.collections.sequences.drop(),
  db.collections.users.drop(),
  db.collections.groups.drop();
  // 生成递增序列
  buildSequences();
  // 生成成员
  buildAdmin();
  buildLeader();
  buildMember();
  buildProposor();
  // 生成组
  buildGroup();
};


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', init);
