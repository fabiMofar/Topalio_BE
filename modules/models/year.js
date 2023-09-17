const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const YearSchema = new Schema({
    case : {type : Schema.Types.ObjectId , ref : 'Case'},
    months : [{type : Schema.Types.ObjectId , ref: 'Month'}],
    title : {type : String , required : true , unique : true},
    deleted : {type : String , default : false}
});

YearSchema.plugin(timestamps);
YearSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Year' , YearSchema);
