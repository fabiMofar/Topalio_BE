const express = require('express');
const router = express.Router();
const apiV1 = require('./api-v1');
const apiV2 = require('./api-v2');

router.use((req , res , next) => {
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
router.use('/v1' , apiV1);
router.use('/v2' , apiV2);



module.exports = router;
