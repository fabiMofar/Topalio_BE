const controller = require('./../controller');
const {validationResult} = require('express-validator');


module.exports = new class permissionController extends controller{

    index(req , res){
        this.model.Permission.paginate({} , { page : 1 , limit : 10 }).then(permissions => {
            res.json({
                data : permissions,
                success : true,
                status : 200
            })
        })
            .catch(err => console.log(err))
    }

    store(req , res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status: 401
            });
        }

        this.model.Permission({
            name : req.body.name,
            label : req.body.label
        }).save(err => {
            if (err) {
                if(err.code == 11000){
                    res.json({
                        data : 'permission in use',
                        success : false,

                    })
                }else{
                    throw err;
                }
            }
            res.json({
                data : 'permission created',
                success : true,
                status : 200
            })
        })
    }

    update(){
        this.model.Permission.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
            label: req.body.label
        } , (err , permission) => {
            if (err) throw err;
            if (permission){
                res.json({
                    data : 'permission updated',
                    success : true,
                    status : 200
                })
            }

            res.json({
                data : 'not found',
                success : false,
                status : 404
            })
        })
    }


    destroy(req ,res){
        this.model.Permission.findByIdAndRemove(req.params.id , (err , permission) => {
            if (err) throw err;
            if (permission){
                res.json({
                    data : 'permission deleted',
                    success : true,
                    status : 200
                })
            }

            res.json({
                data : 'not found',
                success : false,
                status : 404

            })
        })
    }
};
