const controller = require('./../controller');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const mail = require('./../../../middlewares/mail');;
const passport = require('passport');
const uniqueString = require('unique-string');

module.exports = new class AuthController extends controller{

    register(req , res , next){

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

        this.model.User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : req.body.password,
            company : req.body.company,
            tell : req.body.tell,
            postCode : req.body.postCode,
            city : req.body.city,
            address : req.body.address,
            identificationNumber : req.body.identificationNumber,
            taxNumber : req.body.taxNumber,
            roles : req.body.roles,
            birthday : req.body.birthday,
            gender : req.body.gender,
            avatar : avatar
        }).save(err => {
            if(err) {
                if(err.code == 11000) {
                    return res.json({
                        data : 'user has regsitered',
                        status : 11000,
                        success : false
                    })
                } else {
                    throw err;
                }
            }

            return res.json({
                data : 'user regsitered',
                status : 200,
                success : true
            });
        })

        //Send Email to user

        let mailOptions = {
            from : '<info@topalio.de>',
            to : `${req.body.email}`,
            subject : 'Register',
            text : 'welcome to Topalio',
            html : `<h2>welcome to Topalio</h2>`

        };

        mail.sendMail(mailOptions , (err , info) =>{
            if(err) return console.log(err);

            console.log(info.messageId)
        })
    }




    login(req , res , next){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        }
        passport.authenticate('local.login' , (err , user) => {
            if(!user) return res.json({
                data : 'user not found',
                success : false,
                status : 404
            });
            if(err){
                res.json({
                    data : 'login no success',
                    success : false,
                    status : 403
                })
            }
            if(user){
                let token =  jwt.sign({id : user.id} , config.secret , {
                            expiresIn : '2h'
                        });
            
                        res.json({
                            data : {
                                user,
                                token
                            },
                            success : true,
                            status : 200
                        })
            }
        })(req, res , next);
    }



    async forgot(req , res ){
        const errors = await validationResult(req);

        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        }

        let user = await this.model.User.findOne({ email : req.body.email});
        if(! user){
            res.json({
                data : 'user not found',
                success : false,
                status : 404
            })
        }

        const newPasswordReset = new this.model.PasswordReset({
            email : req.body.email,
            resetToken : uniqueString()
        }).save( err =>  {
            if(err){
                res.json({
                    data : 'not success',
                    success : false,
                    status : 403
                });
            }

            res.json({
                data : 'password reseting',
                success : true,
                status : 200
            })

            //send Mail

        })
    }



    async resetPassword(req , res , next){
        const errors = await validationResult(req);

        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        }




        let field = await this.model.PasswordReset.findOne({ $and : [ { email : req.body.email } , { resetToken : req.body.resetToken } ]});
        if(! field){
            res.json({
                data : 'falsche informationen',
                success : false,
                status : 404
            })
        }

        if(field.use){
            res.json({
                data : 'field in use',
                success : false,
                status : 1100
            })
        }

        let user = await this.model.User.findOneAndUpdate({email : field.email} , {$set : {password : req.body.password}});
        await field.update({ use : true} , (err) => {
            res.json({
                data : 'password reseting',
                success : true,
                status : 200
            })
        });
    }

    async checkUser (req , res) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(token){
            return jwt.verify(token , config.secret , (err , decoded) => {
                if(err){
                    return res.json({
                        data : 'Failed to authenticate token.' , 
                        status : 404 ,
                        success : false,
                    })
                }

                this.model.User.findById(decoded.id , (err , user) => {
                    if(err) throw err;
                    if(user) {
                        res.json({
                            data : user,
                            status : 200,
                            success : true
                        })
                    }
                })
            })
        }
    }

    

}



