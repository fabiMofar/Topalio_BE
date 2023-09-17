const Controller = require('./../controller');
const { validationResult } = require('express-validator');


module.exports = new class CaseController extends Controller {

    all(req , res){
        const page = req.query.page || 1;
        this.model.Case.paginate({deleted : false} , {page , limit : 10 , populate : ['user']}).then(cases => {
            if(!cases){
                res.json({
                    data : 'cases not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : cases.docs,
                current_page : cases.page,
                pages : cases.pages,
                total : cases.total,
                success : true,
                status : 200,

            })
        })
        .catch(err => res.json({
            data : 'no success',
            success : false,
            status : 403
        }))
    }

    index(req , res){
        const page = req.query.page || 1;
        this.model.Case.paginate({user : req.query.user_id || req.user._id , deleted : false} , { page , limit : 10}).then( cases => {
            if(! cases){
                res.json({
                    data : 'cases not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : cases.docs,
                current_page : cases.page,
                pages : cases.pages,
                total : cases.total,
                success : true,
                status : 200,

            })
        })
            .catch(err => res.json({
                data : 'no success',
                success : false,
                status : 403
            }))
    }

    store(req , res ){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        } 

        let newCase = new this.model.Case({
            user :  req.query.user_id || req.user._id ,
            title : req.body.title,
            description : req.body.description,
        });
        newCase.save( err => {
            if(err){
                res.json({
                    data : 'error in creating',
                    status : 403,
                    success : false
                })
            }

            res.json({
                data : 'case created',
                status : 200,
                success : true
            })
        })
    }

    update(req ,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        }
        this.model.Case.findByIdAndUpdate(req.params.id , {
            title : req.body.title,
            description : req.body.description
        } , (err ) => {
            if(err){
                res.json({
                    data : 'updating no success',
                    status : 403,
                    success : false,
                   
                })
            }

            res.json({
                data : 'case has updated',
                status : 200 ,
                success : true,
                
            })
        })
    }

    destroy(req ,res){
        this.model.Case.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , cases) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }
            if(!cases){
                res.json({
                    data : 'not found',
                    status : 404,
                    success : false
                })
            }
            res.json({
                data : 'case deleted',
                status : 200 ,
                success : true
            })
        })
    }
};
