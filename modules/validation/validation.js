const {check} = require('express-validator');


exports.validate = (method) => {
    switch (method) {
        case 'case' : {
            return [
                check('title').not().isEmpty().withMessage('enter title'),
                
            ]
        }
        case 'folder' : {
            return [
                check('title').not().isEmpty().withMessage('enter title'),
                
            ]
        }
        case 'year' : {
            return [
            
                check('title').not().isEmpty().withMessage('enter title'),
            ]
        }
        case 'month' : {
            return [
                check('year_id').not().isEmpty().withMessage('enter year_id'),
                check('title').not().isEmpty().withMessage('enter title'),
            ]
        }
        case 'bill' : {
            return [
                check('month_id').not().isEmpty().withMessage('enter month'),
                check('title').not().isEmpty().withMessage('enter title'),
                // check('imageUrl').custom( value => {
                //     if(! value)
                //
                //     if (value){
                //         let fileExt = ['.png' , '.jpg' , '.jpeg'];
                //         if(! fileExt.includes(path.extname(value)))
                //             throw new Error('file Extension')
                //     }
                // })
                // check('fileUrl').custom(async value => {
                //     let fileExt = ['.pdf'];
                //     if(! fileExt.includes(path.extname(value)))
                //         throw new Error('file Extension')
                // })
            ]
        }
        case 'permission' : {
            return [
                check('name').not().isEmpty().withMessage('name is required'),
                check('label').not().isEmpty().withMessage('label is required')
            ]
        }
        case 'role' : {
            return [
                check('name').not().isEmpty().withMessage('name is required'),
                check('label').not().isEmpty().withMessage('label is required'),
            ]
        }
        case 'message' : {
            return [
                check('reciever_id').not().isEmpty().withMessage('reciever_id is required'),
                check('subject').not().isEmpty().withMessage('subject is required'),
                check('body').not().isEmpty().withMessage('body is required'),
            ]
        }
    }
};
