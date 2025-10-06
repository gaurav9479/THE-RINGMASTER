import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/AsyncHandler.js"
const generateAccessRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accesstoken=user.generateAccessToken()
        const refreshtoken=user.generateRefreshToken()
        user.refreshtoken=refreshtoken
        await user.save({validateBeforeSave:false})
        return(accesstoken,refreshtoken)
    }catch(error){
        throw new ApiError(500,"some error ouccured in generating access token and refresh token")
    }
}
const registerUser=asynchandler(async(req,res)=>{
    const{UserName,email,fullname,phone,password}=req.body
    if([UserName,email,fullname,phone,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }
    const exsisteduser=await User.findOne({
        $or:[{email},{phone}]
    })
    if(exsisteduser){
        throw new ApiError(409,"user already exsist")
    }
    const user=await User.create({
        UserName,
        email,
        fullname,
        phone,
        password,
    })
    const createdUser=await User.findById(user._id).select("-password")
    if(!createdUser){
        throw new ApiError(500,"some went wrong while creating the user")
    }
    return res.status(201).json(new ApiResponse(200,createdUser,"user created sucessfully"))
})
const loginUser=asynchandler(async(req,res)=>{
    const {phone,password}=req.body;
    if(!phone||!password){
        throw new ApiError(400,"all credential are required")
    }
    const user=await User.findOne({phone}).select("+password");
    if(!user){
        throw new ApiError(404,"user not exsist")
    }
    const isPasswordvalid=await user.isPasswordCorrect(password);
    if(!isPasswordvalid){
        throw new ApiError(401,"password in correct")
    }
    const {accesstoken,refreshtoken}=await generateAccessRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password","-refreshtoken")
    const options={httpOnly:true,secure:true};
    return res
        .status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",refreshtoken,options)
        .json(new ApiResponse(200,{user:loggedInUser,accesstoken,refreshtoken},"user loggedin sucess fully"))

})
const logoutUser=asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refresToken",options)
    .json(new ApiResponse(200,{},"user loggedout"))
})


export default {
    generateAccessRefreshToken,
    registerUser,
    loginUser,
    logoutUser
}