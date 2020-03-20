var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')
var multiparty = require('multiparty')
var fs = require('fs')
var path = require('path')

router.post('/img', function(req, res, next) {
  var form = new multiparty.Form()
  form.parse(req, function(err, fields, files) {
    if(err) {
      console.log('文件上传失败')
    } else {
      var img = files.filedata[0]
      console.log('文件上传成功', img)
      // 从哪里读取文件流
      var read = fs.createReadStream(img.path)
      // 把文件流写入至哪个路径
      var write = fs.createWriteStream(path.join(__dirname, '../public/upload/'+img.originalFilename))
      // 从读取流 流向 写入流
      read.pipe(write)
      // 当文件写入完成时，把文件的访问路径返回给富文本编辑器
      write.on('close', function() {
        res.send({err: 0, msg: '/upload/'+img.originalFilename})
      })
    }
  })


})

module.exports = router;
