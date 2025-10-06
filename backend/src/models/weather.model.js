import mongoose from "mongoose";
const weatherSchema=new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId,ref:"Trip",require:true},
    date:{type:Date,required:true},
    forecast:{type:String},
    temperature:{min:Number,max:Number},

},{timestamps:true});
export default mongoose.model("Weather",weatherSchema);