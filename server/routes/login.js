var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
  // console.log(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD)
  if(req.body['uname'] == process.env.LOGIN_USERNAME && req.body['passwd'] == process.env.LOGIN_PASSWORD){
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
