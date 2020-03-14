module.exports = (req, res, next) => {
    if (!req.session.logined) {
        return res.redirect('/');
    }
    next();
}