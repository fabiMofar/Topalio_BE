const controller = require('./../controller');
const { validationResult } = require('express-validator');

module.exports = new class StatusController extends controller {

    index (req , res)  {
        const page = req.query.page || 1 ;
        this.model.Status.paginate({} , { page , limit : 10}).then(statuses => {
            if(!statuses){
                res.json({
                    data : 'statuses not found',
                    status : 404,
                    success : false
                })
            }

            res.json({
                data : statuses.docs,
                current_page : statuses.page,
                pages : statuses.pages,
                total : statuses.total,
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

        this.model.Status.findOne({user : req.user._id} , (err , statuses) => {
            if(!statuses){
                let newStatus = new this.model.Status({
                    user : req.user._id,
                    title : req.body.title,
                });
                newStatus.save( err => {
                    if (err) throw err
        
                    res.json({
                        data : 'status created',
                        success: true,
                        status : 200
                    })
                })
            }
            if(statuses){
               if(statuses.title === req.body.title){
                   res.json({
                       data : 'in use',
                       status : 403,
                       success : false
                   })
               }else{
                let newStatus = new this.model.Status({
                    user : req.user._id,
                    title : req.body.title,
                });
                newStatus.save( err => {
                    if (err) throw err
        
                    res.json({
                        data : 'status created',
                        success: true,
                        status : 200
                    })
                })
               }
            }
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
        this.model.Status.findByIdAndUpdate(req.params.id , {
            title : req.body.title,
        } , (err ) => {

            if(err){
                if(err.code == 11000){
                    res.json({
                        data : 'stutus in use',
                        success : false,
                        status : 11000
                    })
                }else{
                    res.json({
                        data : 'updating no success',
                        success : false,
                        status : 403
                    })
                }
            }

            res.json({
                data : 'status has updated',
                success : true,
                status : 200
            })
        })
    }

    destroy(req ,res){
        this.model.Status.findByIdAndRemove(req.params.id , (err , status) => {
            if(! status){
                res.json({
                    data : 'status hat not found',
                    success : false,
                    status : 404
                })
            }
            if(err) {
                res.json({
                    data : 'removing not completed',
                    success : false,
                    status : 403
                })
            }

            res.json({
                data : 'status removed',
                success : true,
                status : 200
            })
        })
    }
    

}