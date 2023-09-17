const controller = require('./../controller');
const {validationResult} = require('express-validator');


module.exports = new class permissionController extends controller{

    index(req , res){
        this.model.Role.paginate({} , { page : 1 , limit : 1 }).then(roles => {
            res.json({
                data : roles,
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

        this.model.Role({
            name : req.body.name,
            label : req.body.label,
            permissions : req.body.permissions
        }).save(err => {
            if (err) {
                if(err.code == 11000){
                    res.json({
                        data : 'role in use',
                        success : false,

                    })
                }else{
                    throw err;
                }
            }
            res.json({
                data : 'Role created',
                success : true,
                status : 200
            })
        })
    }

    update(){
        this.model.Role.findByIdAndUpdate(req.params.id , {
            name : req.body.name,
            label: req.body.label,
            permissions: req.body.permissions
        } , (err , role) => {
            if (err) throw err;
            if (role){
                res.json({
                    data : 'role updated',
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
        this.model.Role.findByIdAndRemove(req.params.id , (err , role) => {
            if (err) throw err;
            if (role){
                res.json({
                    data : 'role deleted',
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
