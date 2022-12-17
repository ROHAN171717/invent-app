const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../middleWare/errorMiddleware");


const contactUs = asyncHandler(async (req,res,next)=>{
    const { subject, message } = req.body;
    const user = await User.findById(req.user._id);

    if(!user){
        return next(new AppError("User not found, please signup...",400));
    }

    //validation
    if (!subject || !message) {
        return next(new AppError("Please add subject and message",400));
    }

    const send_to=process.env.EMAIL_USERNAME;
    const sent_from=process.env.EMAIL_USERNAME;
    const reply_to=user.email;

    try{
        await sendEmail(subject, message, send_to, sent_from, reply_to);
        res.status(200).json({ success: true, message: "Email Sent..."});
    }catch(error){
        return next(new AppError("Email not sent, Please try again...",500)); 
    }
});

module.exports = { contactUs };