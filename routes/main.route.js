const express = require('express');
const router = express.Router();
const syncController = require('../controller/sync.controller');
const userController = require('../controller/user.controller');
const cardController = require('../controller/card.controller');
const redirectIfNotUserMiddleware = require('../middleware/redirectIfNotUser.middleware');
const multer  = require('multer');
const upload = multer(({ dest: 'uploads/' }));

router.get('/sync', syncController.sync);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/change_pass', redirectIfNotUserMiddleware.middleware, userController.changePassword);
router.post('/card/scan', upload.single('uploaded_file'), cardController.scan);

module.exports = router;