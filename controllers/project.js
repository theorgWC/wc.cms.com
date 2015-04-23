//
//== 小组


//
//== 引入
var Group = require('../models/Group');
var User  = require('../models/User');
var Project  = require('../models/Project');


//
//== 引入控制器
var builder = require('./builder');


//
//== 方法

// 添加
var add = function(req, res) {
  var query = req.body;
  var newProject = new Project(query);

  var conditions = { name: newProject.name };

  var tmp = function(seq) {
    Project.findOne(conditions, function(err, doc) {
      if (err) return console.error(err);
      if (doc) return res.json({ status: 0, msg: '该项目已存在' });
      newProject._id = seq;

      newProject.save(function(err, project) {
        console.log(project);
        res.json({ status: 1, data: { project: project } });
      });
    });
  };
  builder.getNextSequence('projects', tmp);
};

// 所有
var all = function(req, res) {
  Project.find(function(err, docs) {
    if (err) return console.error(error);

    res.json({ status: 1, data: {
      projects: docs
    } });
  });
};

// 删除
var del = function(req, res) {
  var _id = req._id;
  if (!_id) return res.json({ status: 0, msg: '发生错误' });
  // Project.findOne({ _id: _id }, function(err, group) {
  //   group.remove(function(err, group) {
  //     if (err) return console.error(err);
  //     res.json({ status: 1, data: { group: group } });
  //   });
  // });
};

// 一个
var one = function(req, res) {
  var query = { _id: req._id},
      base = {};

  Project.findOne(query, function(err, project) {
    if(err) return console.error(err);
    base.name = project.name;
    base.createTime = project.createTime;
    base.description = project.description;
    base.endTime = project.endTime;
    base.beginTime = project.beginTime;
    base.status = project.status;

    Group.findOne({_id: project.group}, '_id name', function(err, group) {
      if(err) return console.error(err);
      base.group = group;
      res.json({ status: 1, project: base});
    });
  });
};

// 更新
var update = function(req, res) {
  var _id = req._id;
  var updateProject = req.body;
  console.log(updateProject)
  console.log(_id)

  Project.findOneAndUpdate({ _id: _id }, updateProject, function(err, project) {
    if (err) return console.error(err);
    console.log(project)
    res.json({ status: 1, msg: '更新成功!' });
  });
};


//
//== 暴露
module.exports = {
  add: add,
  all: all,
  del: del,
  one: one,
  update: update
};