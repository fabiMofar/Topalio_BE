const jwt = require('jsonwebtoken');
const User = require(`./../models/user`);

module.exports = new class Permission {
    token(req , res , next){

        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(token) {
            return jwt.verify(token , config.secret , (err , decoded ) => {
                if(err) {
                    return res.json({
                        success : false ,
                        data : 'Failed to authenticate token.'
                    })
                }

                User.findById(decoded.id , (err , user) => {
                    if(err) throw err;
                    if(user) {
                        user.token = token;
                        req.user = user;
                        next();

                    } else {
                        return res.json({
                            success : false ,
                            data : 'User not found'
                        });
                    }
                })

                // next();
                // return;
            })
        }

        return res.status(403).json({
            data : 'No Token Provided',
            success : false
        })
    }
}
