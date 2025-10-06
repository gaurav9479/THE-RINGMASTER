import mongoose from "mongoose";
const itenenarySchema=new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId,ref:"trip",required:true},
    days:[{
        days:Number,
        activities:[String],
    }]

},{timestamps:true});
export default mongoose.model("itenenary",itenenarySchema);