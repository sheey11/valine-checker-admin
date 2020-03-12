var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var exec = require('child_process').exec;

router.post('/login', function(req, res, next) {
  if(req.param('uname') == 'admin' && req.param('passwd') == '123456'){
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

module.exports = router;
