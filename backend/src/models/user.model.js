import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema=new mongoose.Schema(
    {
        UserName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,

        },
        fullname:{
            type:String,
            required:true,

        },
        phone:{
            type :Number,
            required:true,
        }
        

    },{timestamps:true}
);
export default mongoose.model("User",userSchema);




