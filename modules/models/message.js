const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const MessageSchema = new Schema({
    sender:  {type : Schema.Types.ObjectId , ref : 'User'},
    reciever :  {type : Schema.Types.ObjectId , ref : 'User'},
    subject : {type : String , required : true},
    body : {type : String , required : true},
    summery : {type : String , required : true},
    fileUrl : {type : Array},
    imageUrl : {type : Array},
    seen : {type : Boolean , default : 0}
});

MessageSchema.plugin(timestamps);
MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message' , MessageSchema);
