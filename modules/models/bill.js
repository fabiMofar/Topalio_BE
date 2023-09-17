const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const BillSchema = new Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    month : { type : Schema.Types.ObjectId , ref : 'Month'},
    folder : { type : Schema.Types.ObjectId , ref : 'Folder'},
    status : {type : Schema.Types.ObjectId , ref : 'Status'},
    title: {type : String , required : true },
    description : {type : String },
    fileUrl : {type : Array },
    imageUrl : {type : Array },
    deleted : {type : Boolean , default : false}
});

BillSchema.plugin(timestamps);
BillSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Bill' , BillSchema);
