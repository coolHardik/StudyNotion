const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60 //5minute
    }
});

// a function -> to send emails
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otpTemplate(otp));
        //console.log("Email sent Successfully: ", mailResponse);
    }
    catch(err){
        //console.log("Error occured while seding mails:",err);
        throw err;
    }
}

OTPSchema.pre("save",async function(next){
        // Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);