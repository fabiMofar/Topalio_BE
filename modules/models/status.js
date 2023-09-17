const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const StatusSchema = new Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    title: {type : String , required : true , unique : true },
});

StatusSchema.plugin(timestamps);
StatusSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Status' , StatusSchema);
