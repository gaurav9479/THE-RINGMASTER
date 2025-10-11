import mongoose from "mongoose";

const resturanSchema=new mongoose.Schema({
    name:{type:String,required:true},
    cuisine:{type:String,required:true},
    cost_slot:{type:String,required:true},
    rating:{type:Number,required:true},
    address:{type:String,required:true}

});
export default mongoose.Schema("resturant",resturanSchema);