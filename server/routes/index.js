var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');

router.post('/login', function(req, res, next) {
  if(req.body['uname'] == 'admin' && req.body['passwd'] == '123456'){
    // TODO:
    // 创建 session 记录登录状态
    res.json({
      "code": 200,
      "msg": "success"
    })
  }else{
    res.json({
      "code": -1,
      "msg": "wrong username or password"
    })
  }
});

// TODO:
// 以下方法需要验证是否已登录

router.get('/comments', function(req, res, next){
  exec('python3 checker/comments.py ', function (error, stdout, stderr) {
    if(stderr){
      res.json({
        'code': -1,
        'msg': stderr,
      })
    }else{
      res.contentType = 'application/json';
      res.write(stdout);
      res.end();
    }
  });
});

router.get('/action', function(req, res, next){
  var type = req.query['type'];
  var id = req.query['id'];
  exec('python3 checker/action.py ' + type + ' ' + id, function (error, stdout, stderr) {
    if(stderr){
      res.json({
        'code': -1,
        'msg': stderr,
      })
    }else{
      res.contentType = 'application/json';
      console.log(stdout)
      res.write(stdout);
      res.end();
    }
  });
});

router.get('/logs/list', function(req, res, next){
  var lst = [];

  if(fs.existsSync('checker/logs/')){
    var lst = fs.readdirSync('checker/logs/');
  }
  ret = {
    "code": 200,
    "logs": lst,
  }
  res.json(ret);
});

router.get('/logs/read', function(req, res, next){
  var fname = req.query['filename'];
  var path = 'checker/logs/' + fname;
  if(!fs.existsSync(path)){
    res.json({
      "code": -1,
      "msg": "file does not exsits."
    })
  }else{
    logs = fs.readFileSync(path, {encoding: 'utf-8'});
    res.json({
      "code": 200,
      "msg": "success.",
      "data": logs,
    })
  }
});

router.get('/logs/delete', function(req, res, next){
  var fname = req.query['filename'];
  var path = 'checker/logs/' + fname;
  
  if(fs.existsSync(path)){
    fs.unlinkSync(path);
    res.json({
      "code": 200,
      "msg": "success.",
    })
  }
});

module.exports = router;
