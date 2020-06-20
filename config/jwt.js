const jwt = require('jsonwebtoken');

const privateKey = 'this_is_private_key1238712sa';

const createToken  = (payload) => {
    return jwt.sign(payload, privateKey);
};

const verifyToken = (token) =>{
    return jwt.verify(token, privateKey);
};

exports.createToken = createToken;
exports.verifyToken = verifyToken;
