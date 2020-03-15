module.exports = (req, res, next) => {
    if (!req.session.logined) {
        res.json({
            "code": -1,
            "msg": "请先登录",
        });
        return;
    }
    next();
}