const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');


const UserSchema = new Schema({
    roles : [{type : Schema.Types.ObjectId , ref : 'Role'}],
    firstName : {type : String , required : true},
    lastName : {type : String , required: true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required: true},
    admin : {type : Boolean , required : true , default : 0},
    company : {type : String , required: true},
    tell : {type : String , required: true},
    postCode : {type : String , required: true},
    city : {type : String , required: true},
    address : {type : String , required: true},
    identificationNumber :  {type : String , required: true},
    taxNumber :  {type : String , required: true},
    avatar : {type : String },
    birthday : {type : String , required : true},
    deleted : {type : Boolean , default : false}
});

UserSchema.plugin(timestamps);

UserSchema.pre('save' , function(next){
    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(this.password , salt); 

    this.password = hash;
    next();
});
UserSchema.pre('findByIdAndUpdate' , function(next){
    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(this.password , salt); 

    this.password = hash;
    next();
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password);
}

UserSchema.methods.hasRole = function(roles){
    let result = roles.filter(role => {
        return this.roles.indexOf(role) > -1;
    });

    console.log(result)

    return !! result.length;
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User' , UserSchema);
