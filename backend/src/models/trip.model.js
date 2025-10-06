import mongoose from "mongoose";
import { Schema } from "mongoose";
const tripSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    destination:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    weather:[{type:mongoose.Schema.Types.ObjectId,ref:"weather"}],
    routes:[{type:mongoose.Schema.Types.ObjectId,ref:"routes"}],
    budget:[{type:mongoose.Schema.Types.ObjectId,ref:"budget"}],
    itenenary:[{type:mongoose.Schema.Types.ObjectId,ref:"itenenary"}],
    events:[{type:mongoose.Schema.Types.ObjectId,ref:"events"}],

},{timestamps:true});
export default mongoose.model("trip",tripSchema);