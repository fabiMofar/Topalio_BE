const controller = require('./../controller');
const {validationResult} = require('express-validator');
const fs = require('fs');


module.exports = new class BillController extends controller{
    index(req ,res){
        const page =  req.query.page || 1;
        this.model.Bill.paginate({month : req.query.month_id , deleted : false} || {folder : req.query.folder_id , deleted : false} , { page , limit : 10 , populate : ['status']}).then( bills => {
            if(! bills){
                res.json({
                    data : 'bills not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : bills.docs,
                current_page : bills.page,
                pages : bills.pages,
                total : bills.total,
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

    store(req , res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false
            });
        }




         this.model.Month.findById(req.query.month_id , (err , month ) => {

            if(req.files.imageUrl){
                var images =  req.files.imageUrl.map(image => image.path.replace(/\\/g , '/'))
            }
            if(req.files.fileUrl){
                var files = req.files.fileUrl.map(file => file.path.replace(/\\/g , '/'))
            }
          
    

            let bill = new this.model.Bill({
                month : month._id,
                title : req.body.title,
                description : req.body.description,
                fileUrl : files,
                imageUrl : images,
                share : req.body.share
            });

            bill.save( err => {
                if (err) throw err;
                month.bills.push(bill._id);
                month.save();

                res.json({
                    data : 'bill created',
                    success: true,
                    status : 200
                })
            })
        });
    };

    storeInFolder(req , res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false
            });
        }

        this.model.Folder.findById(req.query.folder_id , (err , folder ) => {

            if(req.files.imageUrl){
                var images =  req.files.imageUrl.map(image => image.path.replace(/\\/g , '/'))
            }
            if(req.files.fileUrl){
                var files = req.files.fileUrl.map(file => file.path.replace(/\\/g , '/'))
            }
    

            let bill = new this.model.Bill({
                folder : folder._id,
                title : req.body.title,
                description : req.body.description,
                fileUrl : files,
                imageUrl : images,
            });

            bill.save( err => {
                if (err) throw err;
                folder.bills.push(bill._id);
                folder.save();

                res.json({
                    data : 'bill created',
                    success: true,
                    status : 200
                })
            })
        });
    }

    single(req , res){
        // req.checkParams('id' , 'incorrect id').isMongoId();
        this.model.Bill.findById(req.params.id , (err , bill) => {
            if (bill){
                res.json({
                    data : bill,
                    success : true
                })
            }

            res.json({
                data : 'not found',
                success : false
            })
        })
    }

    update(req ,res){
        this.model.Bill.findByIdAndUpdate(req.params.id , {
            title : req.body.title,
            description : req.body.description,
            fileUrl : req.body.fileUrl,
            imageUrl : req.body.imageUrl,
        } , (err , bill) => {
            if (err) throw err;
            if (bill){
                res.json({
                    data : 'bill updated',
                    success : true
                })
            }

            res.json({
                data : 'not found',
                success : false
            })
        })
    }

    destroy(req ,res){
        this.model.Bill.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , bill) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }
            if(!bill){
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

    changeStatus(req , res){
        this.model.Bill.findByIdAndUpdate(req.params.id , {
            status : req.body.status_id,
        } , (err , bill) => {
            if (err) throw err;
            if (bill){
                res.json({
                    data : 'bill updated',
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
};
