const controller = require('./../controller');
const { validationResult } = require('express-validator');

module.exports = new  class MessageController extends controller{

    send(req , res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        } 

        if(req.files.imageUrl){
            var images =  req.files.imageUrl.map(image => image.path.replace(/\\/g , '/'))
        }
        if(req.files.fileUrl){
            var files = req.files.fileUrl.map(file => file.path.replace(/\\/g , '/'))
        }

        const sender_id = req.user._id;
        const reciever_id = req.body.reciever_id;
        const summery = req.body.body.substr(0 , 23);

        if(sender_id == reciever_id){
            res.json({
                data : 'sender is reciever',
                status : 403,
                success : false
            })
        }else{
            let newMessage = new this.model.Message({
                sender : sender_id,
                reciever : reciever_id,
                subject : req.body.subject,
                body : req.body.body,
                summery : summery,
                imageUrl : images,
                fileUrl : files
            })
            newMessage.save(err => {
                if(err) throw err;
                res.json({
                    data : 'message send',
                    success: true,
                    status : 200
                })
            })
        }
    }

    inbox(req , res){
        const page = req.query.page || 1;
        this.model.Message.paginate({reciever : req.user._id} , {page , limit : 10 ,  populate : ['sender']}).then(messages => {
            if(!messages){
                res.json({
                    data : 'messages not found',
                    status : 404,
                    success : false
                })
            }

            res.json({
                data : messages.docs,
                current_page : messages.page,
                pages : messages.pages,
                total : messages.total,
                status : 200,
                success : true
            })

        })
        .catch(err => res.json({
            data : 'no success',
            success : false,
            status : 403
        }))
    }

    sentbox(req , res){
        const page = req.query.page || 1;
        this.model.Message.paginate({sender : req.user._id} , {page , limit : 10 ,  populate : ['reciever']}).then(messages => {
            if(!messages){
                res.json({
                    data : 'messages not found',
                    status : 404,
                    success : false
                })
            }

            res.json({
                data : messages.docs,
                current_page : messages.page,
                pages : messages.pages,
                total : messages.total,
                status : 200,
                success : true
            })

        })
        .catch(err => res.json({
            data : 'no success',
            success : false,
            status : 403
        }))
    }

    userList(req , res){
        const page = req.query.page || 1;
        this.model.User.paginate({admin : false , _id : {$ne: req.user._id} }  , {page , limit : 10 }).then(users => {
            if(!users){
                res.json({
                    data : 'users not found',
                    status : 404,
                    success : false
                })
            }

            res.json({
                data : users.docs,
                current_page : users.page,
                pages : users.pages,
                total : users.total,
                status : 200,
                success : true
            })

        })
        .catch(err => res.json({
            data : 'no success',
            success : false,
            status : 403
        }))
    }

    seen(req , res){
        this.model.Message.findByIdAndUpdate(req.params.id , {
            seen : true
        } , (err ) => {
            if(err){
                res.json({
                    data : 'seen no success',
                    success : false,
                    status : 403
                })
            }

            res.json({
                data : 'message seen',
                success : true,
                status : 200
            })
        })
    }
}