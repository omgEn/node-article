var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')


/*文章新增  修改*/
router.post('/create', function(req, res, next) {
  let { title, content, id } = req.body
  let createTime = Date.now()
  // 动态的文章作者
  let username = req.session.username

  if (id) {   // 修改
    articleModel.updateOne({_id: id}, {title, content, username, createTime}).then(()=>{
      res.redirect('/')
    }).catch(err=>{
      res.redirect('/write?id='+id)
    })
  } else {    // 新增
    articleModel.insertMany([{title, content, username, createTime}]).then(()=>{
      // 文章发布成功，跳转至首页
      res.redirect('/')
    }).catch(err=>{
      res.redirect('/write')
    })
  }




})

/*文章删除*/
router.get('/delete', function(req, res, next) {
  var { id } = req.query
  articleModel.deleteOne({_id: id}).then(()=>{
    console.log('删除成功')
    res.redirect('/')
  }).catch(err=>{
    console.log('删除失败')
  })
})

module.exports = router;
