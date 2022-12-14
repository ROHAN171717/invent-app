const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const AppError = require("../middleWare/errorMiddleware");
const User = require("../models/userModel");

const protect=asyncHandler(async (req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return next(new AppError("Not authorized, please login...",401));
        }

        //verify token
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        //get user id from token
        const user=await User.findById(verified.id).select("-password");

        if(!user){
            return next(new AppError("User not found...",401));
        }
        req.user=user;
        next();  


    }catch(error){
        return next(new AppError("Not authorized, please login...",401));
    }
});

module.exports=protect;