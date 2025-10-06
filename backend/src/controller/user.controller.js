import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
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