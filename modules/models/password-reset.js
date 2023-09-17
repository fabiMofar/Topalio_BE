const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');


const PasswordResetSchema = new Schema({
    email : {type : String , required : true},
    resetToken : {type : String , required : true},
    use : {type : Boolean , default : false}
} , {toJSON : {virtuals : true}});

PasswordResetSchema.plugin(timestamps);

PasswordResetSchema.pre('save' , function(next){
    bcrypt.hash(this.password , 15 ,(err , hash) =>{
        this.password = hash;
        next();
    })
});

PasswordResetSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password);
}


module.exports = mongoose.model('PasswordReset' , PasswordResetSchema);
