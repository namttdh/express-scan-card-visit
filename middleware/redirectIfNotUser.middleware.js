exports.middleware = function (req, res, next) {
    if (!req.app.locals.isAuth) return res.status(401).json({status: false, msg: 'unauthorized'});

    return next();
};