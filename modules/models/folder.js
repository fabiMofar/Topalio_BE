const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const FolderSchema = new Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    title: {type : String , required : true , unique : true },
    bills : [{type : Schema.Types.ObjectId , ref: 'Bill'}],
    deleted : {type : Boolean , default : false}
});

FolderSchema.plugin(timestamps);
FolderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Folder' , FolderSchema);
