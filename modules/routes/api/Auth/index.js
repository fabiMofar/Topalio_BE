const express = require('express');
const router = express.Router();
const {api : controllerApi} = config.path.controller;
const authController = require(`${controllerApi}/v1/authController`);
const AuthValidation = require('./../../../validation/AuthValidation');
const {uploadFile } = require('./../../../middlewares/upload');
const permission = require('./../../../middlewares/permission');

router.get('/' , function (req , res) {
    res.json('welcome to Auth api')
});

router.post('/login' ,AuthValidation.validate('login'), authController.login.bind(authController));
router.post('/register' ,  uploadFile.single('avatar') , permission.token ,  AuthValidation.validate('register' ) , authController.register.bind(authController));
router.post('/check-user' , authController.checkUser.bind(authController))
router.post('/forgot-password' , AuthValidation.validate('forgot') ,  authController.forgot.bind(authController));
router.post('/reset-password' , AuthValidation.validate('reset') ,  authController.resetPassword.bind(authController));



module.exports = router;
