var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var exec = require('child_process').exec;

router.post('/login', function(req, res, next) {
  if(req.body['uname'] == 'admin' && req.body['passwd'] == '123456'){
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

router.get('/comments', function(req, res, next){
  exec('python3 server/checker/comments.py ', function (error, stdout, stderr) {
    pwd = process.cwd()
    res.contentType = 'application/json';
    res.write(stdout);
    res.end();
  });
});

router.get('/action', function(req, res, next){
  var type = req.query['type'];
  var id = req.query['id'];
  exec('python3 server/checker/action.py ' + type + ' ' + id, function (error, stdout, stderr) {
    pwd = process.cwd()
    res.contentType = 'application/json';
    console.log(stdout)
    res.write(stdout);
    res.end();
  });
});

module.exports = router;
