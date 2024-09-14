//Razorpay module is required
const Razorpay = require("razorpay"); 

//Instance for razorpay payment
exports.instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET,
});