const controller = require('./../controller');
const { validationResult } = require('express-validator');

module.exports = new class YearController extends controller{

    index(req , res){
        const page = req.query.page || 1
        this.model.Year.paginate({case : req.query.case_id , deleted : false} , { page , limit : 1 }).then( years => {
            if(! years){
                res.json({
                    data : 'years not found',
                    success : false,
                    status : 404
                })
            }
            res.json({
                data : years.docs,
                current_page : years.page,
                pages : years.pages,
                total : years.total,
                status : 200,
                success : true,
                
            })
        })
            .catch(err => res.json({
                data : 'no success',
                status : 403,
                success : false,
                
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

         this.model.Case.findById(req.query.case_id , (err , cases ) => {
            let year = new this.model.Year({
                case : cases._id,
                title : req.body.title,
            });
            year.save( err => {
                if (err) {
                    if(err.code == 11000){
                        res.json({
                            data : 'year in use',
                            status : 11000 ,
                            success : false,
                            
                        })
                    }else{
                       res.json({
                           data : 'create with error',
                           success : false,
                           status :403
                       })
                    }
                }

                cases.years.push(year._id);
                cases.save();

                res.json({
                    data : 'year created',
                    success: true,
                    status : 200
                })
            })
        });
    }




    update(req , res){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({
                messages : errors,
                success : false,
                status : 422
            });
        } 
        
        this.model.Year.findByIdAndUpdate(req.params.id , {
            title : req.body.title,
        } , (err , year ) => {
            if(! year ){
                res.json({
                    data : 'year not found',
                    success : false,
                    status : 404
                })
            }
            if(err){
                if(err.code == 11000){
                    res.json({
                        data : 'year in use',
                        success : false,
                        status : 406
                    })
                }else{
                    res.json({
                        data : 'not updated',
                        success : false,
                        status : 403
                    })
                }
            }
            res.json({
                data : 'Year has updated',
                success : true,
                status : 200
            })
        })
    }




    destroy(req ,res){
        this.model.Year.findByIdAndUpdate(req.params.id , {
            deleted : true
        } , (err , year) => {
            if(err){
                res.json({
                    data : 'delete function error',
                    status : 403,
                    success : false
                })
            }
            if(!year){
                res.json({
                    data : 'not found',
                    status : 404,
                    success : false
                })
            }
            res.json({
                data : 'year deleted',
                status : 200 ,
                success : true
            })
        })
        
    }

    
}