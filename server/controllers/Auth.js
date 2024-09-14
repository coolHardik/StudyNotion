const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt =  require("jsonwebtoken");
const mailSender = require("../utils/mailSender");


require("dotenv").config();

//sendOTP
exports.sendOTP = async(req,res)=>{
    try{
    //fetch email from request ki body
    const {email} = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({email});

    //if user already register exist, then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered",
        })
    }

    //generate OTP
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,        
    });

    //////////console.log("OTP Generated:",otp);

    //check unique or not
    let result  = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,        
        });

        result  = await OTP.findOne({otp:otp});
    }

    const otpPayload = {email,otp};
    //create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    //////////console.log(otpBody);
    
    //return response successfully
    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp,
    });

    }
    catch(err){
        //////////console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

//signup
exports.signUp  = async(req,res)=>{
    try{
         //data fetch from request ki body
    const {
        firstName,
        lastName,
        email, password,confirmPassword,accountType,otp
    } = req.body;

    //////////console.log(firstName,lastName);
    //validate krlo
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        })
    }

    //dono password check karlo
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and ConfirmPassword value does not match, please try again",
        });
    }
    // check user already exist or not
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User is already registered",
        });
    }
    //find most recent OTP stored for the user
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    //////////console.log(recentOtp);

    //validate OTP
    if(recentOtp.length === 0){
        return res.status(400).json({
            success:false,
            message:"OTP not found",
        })
    }
    else if(otp!== recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        });
    }
    
    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //entry create in DB
    const ProfileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    });

const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
const url = `https://api.dicebear.com/5.x/initials/svg?seed=${initials}`;

    const user = await User.create({
        firstName,
        lastName,
        email, password:hashedPassword,accountType,
        //why id
        additionalDetails: ProfileDetails._id,
        image: url, 
    })
    ///return res
    return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        });
    }
    catch(err){
        ////////console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//Login
exports.login = async(req,res)=>{
    try{
        //get data from req body 
        const {email,password} = req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again",
            });
        }
        //check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }
        //generate JWt, after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie parser and send response
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,user,
                message:"Log in SuccessFully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }

    }
    catch(err){
        ////////console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Failure, please try again",
        })
        
    }
}



//change Password
exports.changePassword = async(req,res)=>{
    //get data from req.body
    //get oldPasssword, newPassword, confirmNewPassword
    //validation

    //update pwd in DB
    //send mail- Passsword updated
    //return response

    try {
        // Get data from req.body
        const { oldPassword, newPassword } = req.body;

        // Validation
        if (!oldPassword || !newPassword ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // if (newPassword !== confirmNewPassword) {
        //     return res.status(400).json({ error: 'New passwords do not match' });
        // }

        // Get user from DB (assuming user is authenticated and their ID is in req.user.id)
        const userId = req.user.id; // Adjust based on your authentication mechanism
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        user.password = hashedPassword;
        await user.save();

        // Send email - Password updated
        await mailSender(user.email, 'Password Updated', 'Your password has been successfully updated.');

        // Return response
        res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })
    } 
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// routes/auth.js or similar


