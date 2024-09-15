const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async(req,res)=>{
    try{
        //get email from req body
    const email = req.body.email;
    //check user for this email, email validation
    const user = await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            mesage:"Your Email is not registered with us"
        })
    }
    //generate token
    const token = crypto.randomBytes(20).toString("hex");
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now() + 5*60*1000
    },{new:true});
    
    //console.log("DETAILS",updatedDetails);

    //create URl
    const url = `https://study-notion-three-mauve.vercel.app/update-password/${token}`
    //send mail containing the url
    await mailSender(email, "Password Reset Link",`Your Link for email verification is ${url}. Please click this url to reset your password.`); 
    //return response
    return res.json({
        success:true,
        message:"Email sent successfully, please check email and change password",
    })
    }
    catch(err){
        //console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending pwd reset email",
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try{
            //data fetch
    const {password,confirmPassword,token} = req.body;
    //vaidation
    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching",
        });
    }
    //get userdetails  from db using token
    const userDetails = await User.findOne({token:token});
    // if no entry - invalid token 
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid",
        });
    }
    //token time check
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token is expired, please  regenerate your token",
        });
    }
    //hash pwd
    const hashedPassword = await bcrypt.hash(password,10);
    //passowrd update 
    await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
    //return response
    return res.status(200).json({
        success:true,
        message:"Password reset successfull",
    });
    }
    catch(err){
        //console.log(err);
        return res.status(500).json({
            success:false,
            message:"Unable to reset Password",
        })
    }
}
