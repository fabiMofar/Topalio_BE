const express = require('express');
const router = express.Router();


router.get('/' , function (req , res) {
    res.json('welcome to api version 2')
});



module.exports = router;
