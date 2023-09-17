const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate');


const MonthSchema = new Schema({
    year : {type : Schema.Types.ObjectId , ref : 'Year'},
    bills : [{type : Schema.Types.ObjectId , ref: 'Bill'}],
    title : {type : String , required : true , unique : true},
    deleted : {type : Boolean , default : false}
});

MonthSchema.plugin(timestamps);
MonthSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Month' , MonthSchema);
