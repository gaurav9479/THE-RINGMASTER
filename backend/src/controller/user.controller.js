import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/AsyncHandler.js"

const generateAccessRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "user not found while generating token")
        }

        const accesstoken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();
        user.refreshtoken = refreshtoken;
        await user.save({ validateBeforeSave: false });
        return { accesstoken, refreshtoken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Some error occurred in generating access token and refresh token");
    }
};

const registerUser = asynchandler(async (req, res) => {
    const { UserName, email, fullname, Phone, password, role } = req.body
    console.log("getting info", req.body)
    if ([UserName, email, fullname, Phone, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { Phone }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    const user = await User.create({
        UserName,
        email,
        fullname,
        Phone,
        password,
        role: role || "user"
    })
    const createdUser = await User.findById(user._id).select("-password")
    if (!createdUser) {
        throw new ApiError(500, "some went wrong while creating the user")
    }
    return res
        .status(201)

        .json(new ApiResponse(200, createdUser, "User created successfully"))
})
const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "all credential are required")
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordvalid = await user.isPasswordCorrect(password);
    if (!isPasswordvalid) {
        throw new ApiError(401, "password in correct")
    }
    const { accesstoken, refreshtoken } = await generateAccessRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")
    const options = { httpOnly: true, secure: true };
    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accesstoken, refreshtoken }, "User logged in successfully"))

})
const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "user loggedout"))
})


export {
    generateAccessRefreshToken,
    registerUser,
    loginUser,
    logoutUser
}