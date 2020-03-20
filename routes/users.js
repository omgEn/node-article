var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')

/* 注册 接口 */
router.post('/regist', function(req, res, next) {
  var { username, password, password2 } = req.body
  // 如果两次密码不相等，不能注册
  if (password2 !== password) {
    res.redirect('/regist')
    return
  }
  // 数据不能空
  if (!username || !password || !password2) {
    res.redirect('/regist')
    return
  }
  // 第1步，判断用户名是否已被占用
  userModel.find({username}).then(arr=>{
    if (arr.length > 0) {
      res.redirect('/regist')
    } else {
      // 第2步：注册，入库
      var createTime = Date.now()
      userModel.insertMany([{username, password, createTime}]).then(()=>{
        // 第3步：注册成功，跳转至登录页
        res.redirect('/login')
      }).catch(err=>{
        res.redirect('/regist')
      })
    }
  })

})


/* 登录 接口*/
router.post('/login', function(req, res, next) {
  var { username, password } = req.body
  userModel.find({username, password}).then(arr=>{
    if (arr.length > 0) {
      // 登录成功
      // 向客户端写入cookie，记录用户的登录状态
      req.session.isLogin = true
      req.session.username = username
      res.redirect('/')
    } else {
      // 登录失败
      res.redirect('/login')
    }
  })
})

// 退出登录
router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/login')
})



module.exports = router;
