const session = require('express-session');

const sessionPrivateKey = "session-private-key-asdsadfs";

exports.config = session({
    resave: false,
    saveUninitialized: true,
    secret: sessionPrivateKey
});