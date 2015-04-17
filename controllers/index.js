//
//== 控制器模块

var classeCtrl    = require('./classe');
var loginCtrl     = require('./login');
var signupCtrl    = require('./signup');
var userCtrl      = require('./user');
var groupCtrl     = require('./group');


//
//== 简单的请求控制器

// 获取登录页
var goLogin = function(req, res) {
  res.clearCookie('_id');
  res.clearCookie('_account');
  res.clearCookie('_username');
  res.render('login.html');
};

// 获取首页
var goIndex = function(req, res) {
  res.render('index.html');
};

// 获取注册页
var goSignup = function(req, res) {
  res.render('signup.html');
}
//
//== 暴露
module.exports = {
  goLogin: goLogin,
  goIndex: goIndex,
  goSignup: goSignup,
  logIn: loginCtrl,
  signup: signupCtrl,
  logout: goLogin,
  users: userCtrl,
  classes: classeCtrl,
  groups: groupCtrl
};