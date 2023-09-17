const controller = require('./../controller');
const { validationResult } = require('express-validator');

module.exports = new class MonthController extends controller{

    index(req , res){

        const page = req.query.page || 1

        this.model.Month.paginate({year : req.query.year_id , deleted : false} , { page , limit : 10}).then( months => {
            if(! months){
                res.json({
                    data : 'months not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : months.docs,
                current_page : months.page,
                pages : months.pages,
                total : months.total,
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
                success : false,
                status : 422
            });
        } 
        
         this.model.Year.findById(req.query.year_id , (err , year ) => {
            let month = new this.model.Month({
                year : year._id,
                title : req.body.title,
            });
            month.save( err => {
                if (err) {
                    if(err.code == 11000){
                        res.json({
                            data : 'month in use',
                            success : false,
                            status : 406
                        })
                    }else{
                        throw err;
                    }
                }

                year.months.push(month._id);
                year.save();

                res.json({
                    data : 'month created',
                    success: true,
                    status : 200
                })
            })
        });
    }

    update(req , res){
        this.model.Month.findByIdAndUpdate(req.params.id , {
            title : req.body.title,
        } , (err , month ) => {
            if(! month ){
                res.json({
                    data : 'month not found',
                    success : false,
                    status : 404
                })
            }
            if(err){
                res.json({
                    data : 'not updated',
                    success : false,
                    status : 403
                })
            }
            res.json({
                data : 'month has updated',
                success : true,
                status : 200
            })
        })
    }

    destroy(req ,res){
        this.model.Month.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , month) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }
            if(!month){
                res.json({
                    data : 'not found',
                    status : 404,
                    success : false
                })
            }
            res.json({
                data : 'month deleted',
                status : 200 ,
                success : true
            })
        })
    }
}