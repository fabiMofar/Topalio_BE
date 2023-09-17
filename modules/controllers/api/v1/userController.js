const controller = require('./../controller');
const {validationResult} = require('express-validator');

module.exports = new class userController extends controller{
    index(req, res){
        this.model.User.paginate( {deleted : false} , { page : 1 , limit : 10 }).then(users => {
            res.json({
                data : users.docs,
                current_page : users.page,
                pages : users.pages,
                total : users.total,
                success : true,
                status : 200,
            })
        })
            .catch(err => console.log(err))
    };



    update(req , res ){

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        }

        if(req.file){
            var avatar = req.file.path.replace(/\\/g , '/')
        }
       

        this.model.User.findByIdAndUpdate(req.params.id , {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            company : req.body.company,
            tell : req.body.tell,
            postCode : req.body.postCode,
            city : req.body.city,
            address : req.body.address,
            identificationNumber : req.body.identificationNumber,
            taxNumber : req.body.taxNumber,
            birthday : req.body.birthday,
            avatar : avatar
        } , (err , user) => {
            if (err) throw err;
            if (user){
                res.json({
                    data : 'user updated',
                    status : 200,
                    success : true
                })
            }

            res.json({
                data : 'not found',
                status : 404,
                success : false
            })
        })
    }

    toggleAdmin(req , res){
        this.model.User.updateOne({_id : req.params.id} , {admin : req.body.admin} , (err) => {
            if (err) throw err;
            res.json({
                data : 'admin added'
            })
        })

        // this.model.User.findById(req.params.id , (err , user) => {
        //     if (! user){
        //         res.json({
        //             data : 'not found',
        //             success : false,
        //             status : 404
        //         })
        //     }

        //     user.set({admin : ! user.admin});
        //     user.save(err => {
        //         if (err) throw err;

        //         res.json({
        //             data : 'user to admin',
        //             success : true,
        //             status : 200
        //         })
        //     })
        // })
    }

    addRole(req , res){
        this.model.User.updateOne({_id : req.params.id} , {roles : req.body.roles} , (err) => {
            if (err) throw err;
            res.json({
                data : 'roles added',
                success : true,
                status : 200
            })
        })
        // this.model.User.findById(_id : req.params.id , (err , user) => {
        //     if (! user){
        //         res.json({
        //             data : 'user not found',
        //             success : false,
        //             status : 404
        //         })
        //     }
        //     if (user){
        //         user.set({roles : req.body.roles});
        //         user.save( err => {
        //             if (err) throw err;

        //             res.json({
        //                 data : 'roles added',
        //                 success : true,
        //                 status : 200
        //             })
        //         })
        //     }
        // })
    }

    destroy(req , res){
        this.model.User.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }

            res.json({
                data : 'user deleted',
                status : 200 ,
                success : true
            })
        })
    };

    single(req , res){
        this.model.User.findById(req.params.id , (err , user) => {
            if(!user){
                res.json({
                    data : 'kein benutzer',
                    status : 404,
                    success : false
                })
            }
            if(err){
                res.json({
                    data : 'error',
                    status : 403,
                    success : false
                })
            }

            res.json({
                data : user,
                status : 200,
                success : true
            })
        })

    }
};
