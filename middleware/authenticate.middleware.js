const jwt = require('../config/jwt');

exports.middleware = function (req, res, next) {
    req.app.locals.isAuth = false;
    req.app.locals.user = {};
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            let user = jwt.verifyToken(token);
            if (req.session.userLoginToken && req.session.userLoginToken[user._id] === token) {
                req.app.locals.user = user;
                req.app.locals.isAuth = true;
            }
        } catch (e) {

        }
    }

    return next();
};