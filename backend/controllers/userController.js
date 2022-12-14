const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const AppError = require("../middleWare/errorMiddleware");
const User = require("../models/userModel");
const { use } = require("bcrypt/promises");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
}

//REGISTER USER
const registerUser=asyncHandler(async (req,res,next)=>{
    const { name, email, password } = req.body;

    //validation
    if(!name || !email || !password){
        return next(new AppError("Please fill in all required fields...",400))
    }

    if(password.length < 6){
        return next(new AppError("Password must be up to 6 character...",400))
    }

    //check if user email already exists
    const userExists=await User.findOne({ email })

    if(userExists){
        return next(new AppError("Email has already been registered...",400))
    }

    //create new user
    const user=await User.create({
        name,
        email,
        password
    })

    //Generate Token
    const token=generateToken(user._id);
    console.log(token);
    

    //Sent HTTP only cookie
    res.cookie("token",token,{
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 Day
        sameSite: "none",
        // secure: true,
    });

    if(user){
        const { _id, name, email, photo, phone, bio }=user;
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        })
    }else{
        return next(new AppError("Invalid user data...",400))
    }
})

//LOGIN USER
const loginUser=asyncHandler(async (req,res,next)=>{
    const { email, password } = req.body;

    //validation
    if(!email || !password){
        return next(new AppError("Please add email and password...",400));
    }
    
    //check user exists or not
    const user=await User.findOne({email});

    if(!user){
        return next(new AppError("user not found, please signup...",400))
    }

    //user exist, compare password
    const isPasswordCorrect=await bcrypt.compare(password,user.password);

    //generate token
    const token=generateToken(user._id);

    //Sent HTTP only cookie
    res.cookie("token",token,{
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 Day
        sameSite: "none",
        // secure: true,
    });

    if(user && isPasswordCorrect){
        const { _id, name, email, photo, phone, bio }=user;
        res.status(200).json({
            _id, name, email, photo, phone, bio, token
        })
    }else{
        return next(new AppError("Invalid email or password...",400))
    }
})

//LOGOUT USER
const logoutUser=asyncHandler(async (req,res,next)=>{
    res.cookie("token","",{
        path: "/",
        httpOnly: true,
        expires: new Date(0), //current second
        sameSite: "none",
        // secure: true,
    });
    return res.status(200).json({ message:"Successfully Logged Out..."});
})

//GET USER DATA
const getUser=asyncHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id);
    
    if(user){
        const { _id, name, email, photo, phone, bio }=user;
        res.status(200).json({
            _id, name, email, photo, phone, bio
        })
    }else{
        return next(new AppError("User Not Found...",400))
    }
})

//GET LOGIN STATUS
const getLoginStatus=asyncHandler(async (req,res,next)=>{
    const token=req.cookies.token;

    if(!token){
        return res.json(false);
    }

    //verify token
    const verified=jwt.verify(token,process.env.JWT_SECRET);
    
    if(verified){
        return res.json(true);
    }
    return res.json(false);
})

//UPDATE USER
const updateUser=asyncHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id);

    if(user){
        const { name, email, photo, phone, bio } = user;
        user.email=email;
        user.name=req.body.name || name;
        user.phone=req.body.phone || phone;
        user.bio=req.body.bio || bio;
        user.photo=req.body.photo || photo;

        const updatedUser=await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            photo:updatedUser.photo,
            phone:updatedUser.phone,
            bio:updatedUser.bio
        })
    }else{
        return next(new AppError("User not found...",404));
    }
})

//CHANGE PASSWORD
const changePassword=asyncHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id);
    const { oldPassword, password } = req.body;

    //validation
    if(!user){
        return next(new AppError("User not found, please signup...",400));
    }
    if(!oldPassword || !password){
        return next(new AppError("Please add old and new password...",400))
    }
    if(password.length < 6){
        return next(new AppError("Password must be up to 6 character...",400))
    }

    //check if old password match with password in DB
    const passwordIsCorrect=await bcrypt.compare(oldPassword,user.password);

    //save new password
    if(user && passwordIsCorrect){
        user.password=password;
        await user.save();
        res.status(200).send("Password change successful...");
    }else{
        return next(new AppError("Old password is incorrect...",400));
    }
})

//FORGOT PASSWORD
const forgotPassword=asyncHandler(async (req,res,next)=>{
    res.send("forgot password...")
})


module.exports={ registerUser, loginUser, logoutUser, getUser, getLoginStatus, updateUser, changePassword, forgotPassword };