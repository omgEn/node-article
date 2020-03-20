var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')

/* 首页 */
router.get('/', function(req, res, next) {
  console.log('session', req.session)
  // 获取前端传递过来的页码
  let { page } = req.query
  // 如果用户没有传递页码，默认显示第一页
  page = page ? page : 1

  // 第一步：查询文章的总条数，用于分页
  articleModel.find().count().then(total=>{
    // 总页码
    var num = Math.ceil(total / 5)

    // 第二步：查询当前页的文章列表
    articleModel.find().sort({createTime: -1}).skip((page-1)*5).limit(5).then(arr=>{
      res.render('index', {list: arr, num: num, username: req.session.username})
    }).catch(err=>{
      res.redirect('/')
    })
  })
});

/* 注册页 */
router.get('/regist', function(req, res, next) {
  res.render('regist', {})
})

/* 登录页 */
router.get('/login', function(req, res, next) {
  res.render('login', {})
})

/* 发布、修改文章的页面 */
router.get('/write', function(req, res, next) {
  var { id } = req.query
  if(id) {   // 编辑
    // id = new Object(id)
    articleModel.find({_id:id}).then(arr=>{
      res.render('write', {article: arr[0], username: req.session.username})
    }).catch(err=>{
      res.redirect('/')
    })
  } else {   // 新增
    var article = {
      title: '',
      content: '',
      id: ''
    }
    res.render('write', {article:article, username: req.session.username})
  }

})

/* 文章详情页 */
router.get('/detail', function(req, res, next) {
  var { id } = req.query
  // id = new Object(id)
  articleModel.find({_id: id}).then(arr=>{
    console.log('文章', arr)
    if (arr.length > 0) {
      res.render('detail', {article: arr[0], username: req.session.username})
    } else {
      res.redirect('/')
    }
  }).catch(err=>{
    res.redirect('/')
  })

})

module.exports = router;
