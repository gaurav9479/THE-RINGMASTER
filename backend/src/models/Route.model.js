import mongoose from "mongoose";
const routeSchema=new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId,ref:"trip",require:true},
    origin:{type:String},
    destination:{type:String},
    distance:{type:Number},
    duration:{type:Number},
    mode:{type:String,enum:["car","train","bus","flight","walk"]},

},{timestamps:true});
export default mongoose.model("Route",routeSchema);