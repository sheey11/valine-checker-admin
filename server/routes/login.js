var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
  if(req.body['uname'] == 'admin' && req.body['passwd'] == '123456'){
    req.session.logined = true;

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

module.exports = router;
