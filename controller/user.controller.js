const Users = require('../model/users.model');
const bcrypt = require('bcrypt');
const jwt = require('../config/jwt');

exports.register = async function (req, res) {
    console.log(req.body.password);
    let user = new Users(
        {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
        }
    );
    try{
        await user.save();
        res.send({success: true, msg: 'Tạo tài khoản thành công'})
    } catch (e) {
        if (e.message.indexOf('duplicate key error') !== -1){
            return res.send({success: false, msg: 'Email đã tồn tại'})
        }

        return res.send({success: false, msg: 'Tạo tài khoản lỗi'})
    }
};

exports.login = async function (req, res) {
    let user = await Users.findOne({email: req.body.email});
    if (user) {
        let match = await bcrypt.compare(req.body.password, user.password);
            if (match) {

            let userPayload = user.toObject();
            console.log(req.session);
            userPayload.password = undefined;
            if (!req.session.userLoginToken) {
                req.session.userLoginToken = {};
            }
            if (!req.session.userLoginToken[user._id]) {
                req.session.userLoginToken[user._id] = await jwt.createToken(userPayload);
            }

            return res.send({success: true, access_token: req.session.userLoginToken[user._id]});
        }
    }

    return res.send({success: false, msg: 'Tài khoản hoặc mật khẩu không đúng'});
};

exports.changePassword = async function (req, res) {
    let user = await Users.findOne({_id: req.app.locals.user._id});
    if (user) {
        let match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            if (req.session.userLoginToken && req.session.userLoginToken[user._id]) {
                delete req.session.userLoginToken[user._id];
            }

            user.password = await bcrypt.hash(req.body.new_password, 10);
            try {
                await user.save();
                return res.send({success: true, msg: 'Thây đổi mật khẩu thành công. Vui lòng đăng nhập lại'});
            } catch (e) {
                return res.send({success: false, msg: 'Thay đổi mật khẩu lỗi'});
            }
        }
    }

    return res.send({success: false, msg: 'Mật khẩu cũ không đúng'});
};