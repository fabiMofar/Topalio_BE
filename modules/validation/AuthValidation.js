const {check} = require('express-validator');


exports.validate = (method) => {
    switch (method) {
        case 'login' : {
            return [
                check('email').isEmail().withMessage('invalid Email'),
                check('password').not().isEmpty().withMessage('enter your password')
            ]
        }
        case 'register' : {
            return [
                check('firstName').not().isEmpty(),
                check('lastName').not().isEmpty(),
                check('email').isEmail().withMessage('email is invalid'),
                check('password').isLength({min : 6}).withMessage('password is invalid'),
                check('company').not().isEmpty(),
                check('tell').not().isEmpty(),
                check('identificationNumber').not().isEmpty(),
                check('taxNumber').not().isEmpty(),
                check('postCode').not().isEmpty(),
                check('city').not().isEmpty(),
                check('address').not().isEmpty(),
                check('birthday').not().isEmpty(),
            ]
        }
        case 'update-user' : {
            return [
                check('firstName').not().isEmpty(),
                check('lastName').not().isEmpty(),
                check('company').not().isEmpty(),
                check('tell').not().isEmpty(),
                check('identificationNumber').not().isEmpty(),
                check('taxNumber').not().isEmpty(),
                check('postCode').not().isEmpty(),
                check('city').not().isEmpty(),
                check('address').not().isEmpty(),
                check('birthday').not().isEmpty(),
            ]
        }
        case 'forgot' : {
            return [
                check('email').isEmail().withMessage('email is invalid'),
            ]
        }
        case 'reset' : {
            return [
                check('email').isEmail().withMessage('email is invalid'),
                check('password').isLength({min : 6}).withMessage('password is invalid'),
                check('resetToken').not().isEmpty().withMessage('invalid porccess')
            ]
        }
    }
}
