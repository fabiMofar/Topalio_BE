const Controller = require('../controller');
const { validationResult } = require('express-validator');


module.exports = new class FolderController extends Controller {

    all(req , res){
        const page = req.query.page || 1;
        this.model.Folder.paginate({} , {page , limit : 10 , populate : ['user']}).then(folders => {
            if(!folders){
                res.json({
                    data : 'folders not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : folders.docs,
                current_page : folders.page,
                pages : folders.pages,
                total : folders.total,
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
        this.model.Folder.paginate({user : req.user._id || req.body.user_id , deleted : false} , { page , limit : 10}).then( folders => {
            if(! folders){
                res.json({
                    data : 'folders not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : folders.docs,
                current_page : folders.page,
                pages : folders.pages,
                total : folders.total,
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

        this.model.Folder.findOne({user : req.user._id} , (err , folders) => {
            if(!folders){
                let newFolder = new this.model.Folder({
                    user : req.user._id,
                    title : req.body.title,
                });
                newFolder.save( err => {
                    if (err) throw err
        
                    res.json({
                        data : 'folder  created',
                        success: true,
                        status : 200
                    })
                })
            }
            if(folders){
               if(folders.title === req.body.title){
                   res.json({
                       data : 'in use',
                       status : 403,
                       success : false
                   })
               }else{
                let newFolder = new this.model.Folder({
                    user : req.user._id,
                    title : req.body.title,
                });
                newFolder.save( err => {
                    if (err) throw err
        
                    res.json({
                        data : 'folder  created',
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
        this.model.Folder.findByIdAndUpdate(req.params.id , {
            user : req.user._id,
            title : req.body.title,
        } , (err ) => {

            if(err){
                if(err.code == 11000){
                    res.json({
                        data : 'folder in use',
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
                data : 'folder has updated',
                success : true,
                status : 200
            })
        })
    }

    destroy(req ,res){

        this.model.Folder.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , folder) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }
            if(!folder){
                res.json({
                    data : 'not found',
                    status : 404,
                    success : false
                })
            }
            res.json({
                data : 'folder deleted',
                status : 200 ,
                success : true
            })
        })
    }
};
