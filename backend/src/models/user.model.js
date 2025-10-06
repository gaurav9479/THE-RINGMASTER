import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
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
        },
        password:{
            type:String,
            required:true,
        }
        

    },{timestamps:true}
);
userSchema.pre("save",async function(next) {
    if(!this.isModified("password"))return next();
    console.log("Passwords recived",this.password)
    this.password= await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function (password) {
    bcrypt.compare(password,this.password)
}
userSchema.methods.generateAcessToken=function(){
    jwt.sign({
        _id:this.id,
        username:this.UserName,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    },
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this.id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    },
    )
    
}

export default mongoose.model("User",userSchema);




