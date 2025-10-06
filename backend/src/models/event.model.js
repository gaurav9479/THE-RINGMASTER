import mongoose from "mongoose";
const eventSchema=new mongoose.Schema({
    trip:{type:mongoose.Schema.Types.ObjectId, ref:"trip",required:true},
    name:{type:String, required:true}
})
export default mongoose.model("Events",eventSchema)