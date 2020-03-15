var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');
var checkSession = require('../middlewares/check-session')
var vcDaemon = require('../middlewares/valine-checker-daemon');

router.use(checkSession);

var ifInjected = (filename, res) => {
  // 防注入
  if(filename.indexOf("/") != -1 || filename.indexOf("\\") != -1){
    return true;
  }
  return false;
};

// ====================
// 对 Comments 的操作
// ====================
router.get('/comments', (req, res, next) => {
  exec(process.env.PYTHON_COMMAND + ' checker/comments.py ', function (error, stdout, stderr) {
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

router.get('/action', (req, res, next) => {
  var type = req.query['type'];
  var id = req.query['id'];
  exec(process.env.PYTHON_COMMAND + ' checker/action.py ' + type + ' ' + id, function (error, stdout, stderr) {
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


// ====================
// 对 logs 的操作
// ====================
router.get('/logs/list', (req, res, next) => {
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

router.get('/logs/read', (req, res, next) => {
  var fname = req.query['filename'];

  if(ifInjected(fname)){
    res.status(403).json({
      "code": 403,
      "msg": "wrong file name."
    });
  }

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

router.get('/logs/delete', (req, res, next) => {
  var fname = req.query['filename'];

  if(ifInjected(fname)){
    res.status(403).json({
      "code": 403,
      "msg": "wrong file name."
    });
  }

  var path = 'checker/logs/' + fname;
  
  if(fs.existsSync(path)){
    fs.unlinkSync(path);
    res.json({
      "code": 200,
      "msg": "success.",
    })
  }
});


// ====================
// 对 valine-checker 的操作
// ====================
router.get('/vc/launch', (req, res, next) => {
  json = vcDaemon.launch()
  res.json(json)
})

router.get('/vc/stop', (req, res, next) => {
  json = vcDaemon.stop()
  res.json(json)
})

router.get('/vc/status', (req, res, next) => {
  res.json({
    "code": 200,
    "status": vcDaemon.status,
  })
})

router.get('/vc/errmsg', (req, res, next) => {
  res.json({
    "code": 200,
    "msg": vcDaemon.errmsg,
  })
})

module.exports = router;
