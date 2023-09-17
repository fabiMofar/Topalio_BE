

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const roleSchema = Schema({
    permissions : [{type : Schema.Types.ObjectId , ref : 'Permission'}],
    name : {type : String , required : true , unique : true},
    label : {type: String , required: true}
} , {toJSON : { virtuals : true }});

roleSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Role' , roleSchema);
