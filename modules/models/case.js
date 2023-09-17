const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const CaseSchema = new Schema({
    user : {type : Schema.Types.ObjectId , ref : 'User'},
    years : [{type : Schema.Types.ObjectId , ref : 'Year'}],
    title: {type : String , required : true },
    description : {type : String },
    deleted : {type : Boolean , default : false}
});

CaseSchema.plugin(timestamps);
CaseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Case' , CaseSchema);
