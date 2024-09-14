const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//authentication
exports.auth = async(req,res,next) =>{
    try{
        //extract token
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        //console.log("token",token);
        //id token is misssing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }

        //verfiy the token
        try{
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
            //console.log(decode);
        }
        catch(err){
            //verification issues
            return res.status(401).json({
                success:false,
                message:"token is Invalid",
            });
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

//isStudent
exports.isStudent = async(req,res,next) =>{
    try{
        const userDetails = await User.findOne({ email: req.user.email });

        if(userDetails.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again",
        })
    }
}


//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again",
        })
    }
}


 //isAdmin

 exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again",
        })
    }
 }