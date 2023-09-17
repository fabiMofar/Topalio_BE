const controller = require('./../controller');


module.exports = new class HomeController extends controller {
    caseCount(req , res) {
        this.model.Case.countDocuments(function(err , count){
            if(err){
                res.json({
                    data : err,
                    status : 403,
                    success : true
                })
            }
            res.json({
                data : count,
                status : 200,
                success : true
            })
         })
        
    }

    userCount(req , res){
        this.model.User.countDocuments( function(err , count){
            if(err){
                res.json({
                    data : err,
                    status : 403,
                    success : true
                })
            }
            res.json({
                data : count,
                status : 200,
                success : true
            })
        })
    }

    folderCount(req ,res){
        this.model.Folder.countDocuments(function(err , count){
            if(err){
                res.json({
                    data : err,
                    status : 403,
                    success : true
                })
            }
            res.json({
                data : count,
                status : 200,
                success : true
            })
        })
    }
}