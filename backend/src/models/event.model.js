import mongoose from "mongoose";
const eventSchema=new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId, ref:"trip",required:true},
    name:{type:String, required:true},
    ticket:{type:String}
})
export default mongoose.model("Events",eventSchema)