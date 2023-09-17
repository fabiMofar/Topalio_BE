const express = require('express');
const router = express.Router();

//Controllers
const {api : controllerApi} = config.path.controller;
const caseController = require(`${controllerApi}/v1/caseController`);
const yearController = require(`${controllerApi}/v1/yearController`);
const monthController = require(`${controllerApi}/v1/monthController`);
const billController = require(`${controllerApi}/v1/billController`);
const userController = require(`${controllerApi}/v1/userController`);
const permissionController = require(`${controllerApi}/v1/permissionController`);
const roleController = require(`${controllerApi}/v1/roleController`);
const homeController = require(`${controllerApi}/v1/homeController`);
const folderController = require(`${controllerApi}/v1/folderController`);
const statusController = require(`${controllerApi}/v1/statusController`);
const messageController = require(`${controllerApi}/v1/messageController`);

//middlewares
const permission = require('./../../middlewares/permission');
const {uploadFile } = require('./../../middlewares/upload');
const validation = require('./../../validation/validation');
const gate = require('./../../middlewares/gate');
const authValidation = require('./../../validation/AuthValidation');



router.get('/' , function (req , res) {
    res.json('welcome to api version 1')
});




//Auth Routes
const authApi = require('./Auth/index');
router.use('/auth' , authApi);

// Case Routes
const caseRouter = express.Router();
caseRouter.get('/all' , permission.token , caseController.all.bind(caseController));
caseRouter.get('/' , permission.token, caseController.index.bind(caseController));
caseRouter.post('/create' , permission.token , validation.validate('case'), caseController.store.bind(caseController));
caseRouter.put('/edit/:id' , permission.token , validation.validate('case'), caseController.update.bind(caseController));
caseRouter.post('/delete/:id' , permission.token , caseController.destroy.bind(caseController));

router.use('/case' , caseRouter);

// Year Routes
const yearRouter = express.Router();
yearRouter.get('/' , permission.token, yearController.index.bind(yearController));
yearRouter.post('/create' , permission.token , validation.validate('year'), yearController.store.bind(yearController));
yearRouter.put('/edit/:id' , permission.token , validation.validate('year'), yearController.update.bind(yearController));
yearRouter.post('/delete/:id' , permission.token , yearController.destroy.bind(yearController));

router.use('/year' , yearRouter);

// month Routes
const monthRouter = express.Router();
monthRouter.get('/' , permission.token, monthController.index.bind(monthController));
monthRouter.post('/create' , permission.token , validation.validate('month'), monthController.store.bind(monthController));
monthRouter.put('/edit/:id' , permission.token , validation.validate('month'), monthController.update.bind(monthController));
monthRouter.post('/delete/:id' , permission.token , monthController.destroy.bind(monthController));

router.use('/month' , monthRouter);

//bills Routes
const billRouter = express.Router();
billRouter.get('/'  , permission.token , billController.index.bind(billController));
billRouter.post('/create' , permission.token , uploadFile.fields([{name : 'imageUrl' , maxCount : 12} , {name : 'fileUrl' , maxCount: 12}]) ,  validation.validate('bill'), billController.store.bind(billController));
billRouter.put('/edit/:id' , permission.token , billController.update.bind(billController));
billRouter.post('/delete/:id' , permission.token , billController.destroy.bind(billController));
billRouter.get('/single/:id' , permission.token , billController.single.bind(billController));
billRouter.post('/store-in-folder' , permission.token ,  uploadFile.fields([{name : 'imageUrl' , maxCount : 12} , {name : 'fileUrl' , maxCount: 12}]) , billController.storeInFolder.bind(billController));
billRouter.post('/change-status/:id' , permission.token ,  billController.changeStatus.bind(billController));

router.use('/bills' , billRouter);

//user Routes
const userRouter = express.Router();
userRouter.get('/' ,  permission.token , userController.index.bind(userController));
userRouter.put('/edit/:id' ,  uploadFile.single('avatar') ,  authValidation.validate('update-user' )  , permission.token ,   userController.update.bind(userController));
userRouter.get('/single/:id' , permission.token , userController.single.bind(userController));
userRouter.post('/toggle/:id' , userController.toggleAdmin.bind(userController));
userRouter.post('/addrole/:id' , userController.addRole.bind(userController));
userRouter.post('/delete/:id' , permission.token,  userController.destroy.bind(userController));

router.use('/users' , userRouter);

//Permission Routes
const permissionRouter = express.Router();
permissionRouter.get('/all' , permissionController.index.bind(permissionController));
permissionRouter.post('/create' , validation.validate('permission') , permissionController.store.bind(permissionController));
permissionRouter.put('/edit/:id' , validation.validate('permission') , permissionController.update.bind(permissionController));
permissionRouter.delete('/delete/:id' , permissionController.destroy.bind(permissionController));

router.use('/permission' , permissionRouter);

//Role Routes
const roleRouter = express.Router();
roleRouter.get('/all' , roleController.index.bind(roleController));
roleRouter.post('/create' , validation.validate('role') , roleController.store.bind(roleController));
roleRouter.put('/edit/:id' , validation.validate('role') , roleController.update.bind(roleController));
roleRouter.delete('/delete/:id' , roleController.destroy.bind(roleController));

router.use('/role' , roleRouter);

//Home Routes

const homeRouter = express.Router();
homeRouter.get('/case-count' , homeController.caseCount.bind(homeController));
homeRouter.get('/user-count' , homeController.userCount.bind(homeController));
homeRouter.get('/folder-count' , homeController.folderCount.bind(homeController));

router.use('/home' , homeRouter);

//folders Routes

const folderRouter = express.Router();
folderRouter.get('/all' , permission.token ,  folderController.all.bind(folderController));
folderRouter.get('/' , permission.token ,  folderController.index.bind(folderController));
folderRouter.post('/create' , permission.token , validation.validate('folder'), folderController.store.bind(folderController));
folderRouter.put('/edit/:id' , permission.token , validation.validate('folder'), folderController.update.bind(folderController));
folderRouter.post('/delete/:id' , permission.token , folderController.destroy.bind(folderController));

router.use('/folder' , folderRouter);

//Status Routes
const statusRouter = express.Router();
statusRouter.get('/' , permission.token , statusController.index.bind(statusController))
statusRouter.post('/create' , permission.token , statusController.store.bind(statusController));

router.use('/status' , statusRouter);


//Message Routes

const messageRouter = express.Router();
messageRouter.post('/send' , permission.token ,  uploadFile.fields([{name : 'imageUrl' , maxCount : 12} , {name : 'fileUrl' , maxCount: 12}]) , validation.validate('message') , messageController.send.bind(messageController));
messageRouter.get('/inbox' , permission.token , messageController.inbox.bind(messageController));
messageRouter.get('/sentbox' , permission.token , messageController.sentbox.bind(messageController));
messageRouter.get('/user-list' , permission.token , messageController.userList.bind(messageController));
messageRouter.post('/seen/:id' , permission.token , messageController.seen.bind(messageController));

router.use('/message' , messageRouter);








module.exports = router;
