import mongoose, { Schema } from "mongoose";
const budgetSchema = new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId, ref:"Trip",required:true},
    transport:{type:Number,required:true},
    accomodation:{type:Number,required:true},
    food:{type:Number,default:0},
    misc:{type:Number,default:0},
    total:{type:Number,default:0},

},{timestamps:true});
export default mongoose.model("Budget",budgetSchema);