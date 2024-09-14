const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto")
const CourseProgress = require("../models/CourseProgress")

//initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  //console.log("lol",courses.length);
  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide Course Id",
    });
  }

  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Unable to find the course",
        });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled",
        });
      }
      totalAmount += course.price;
    } catch (err) {
      //console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  }
  
  try { 
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    })

  } catch (err) {
    //console.log(err);
    return res.status(500).json({
      success: false,
      message: "Could not Initiate order",
    });
  }
};

//verfiy the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  //console.log("bhai");
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "payment Failed",
    });
  }
  //console.log("yaha");
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  //console.log("tak");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  //console.log("expectedSignature",expectedSignature)
  //console.log("razorpay_signature",razorpay_signature)
  if (expectedSignature === razorpay_signature) {
    //Enroll Student
    await enrollStudents(courses, userId, res);
    //return res
    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  }

  return res.status(200).json({
    success: false,
    message: "Payment Failed",
  });
};

const enrollStudents = async (courses, userId, res) => {
    try{
        if (!courses || !userId || !res) {
            return res.status(400).json({
              success: false,
              message: "Please provide data for courseId or userId",
            });
          }
        
          for (const courseId of courses) {
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
              { _id: courseId },
              {
                $push: { studentsEnrolled: userId },
              },
              { new: true },
            )
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }
            const courseProgress = await CourseProgress.create({
              courseID:courseId,
              userId:userId,
              completedVideos: [],
          })
            //find the enrollment and add the course to their list of enrolledCourses
            const enrolledStudent = await User.findByIdAndUpdate(userId,{
                $push:{
                    courses:courseId,
                    courseProgress: courseProgress._id,
                }
            },{new:true})
            //Send mail 
            const emailResponse = await mailSender(
                enrollStudents.email,
                // enrolledStudent.email,
                `SuccessFully Enrolled Course into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`{${enrolledStudent.firstName}${" "}${enrolledStudent.lastName}}`)
            )
        
            // //console.log("Email Sent Successfully",emailResponse);
    }
  }catch(err){
    //console.log(err);
    return res.status(200).json({
        success:false,
        message:err.message
    })
  }
};

exports.sendPaymentSuccessEmail = async(req, res) => {
  const {orderId, paymentId, amount} = req.body;

  const userId = req.user.id;

  if(!orderId || !paymentId || !amount || !userId) {
      return res.status(400).json({success:false, message:"Please provide all the fields"});
  }

  try{
      //student ko dhundo
      const enrolledStudent = await User.findById(userId);
      await mailSender(
          enrolledStudent.email,
          `Payment Recieved`,
           paymentSuccessEmail(`${enrolledStudent.firstName}`,
           amount/100,orderId, paymentId)
      )
  }
  catch(error) {
      //console.log("error in sending mail", error)
      return res.status(500).json({success:false, message:"Could not send email"})
  }
}


//capture the payment and intiate the Razorpay order
// exports.capturePayment = async(req,res)=>{
//     //gt CourseId and UserId
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseId
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"Please provide valid courseId",
//         })
//     }
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:"Could not find the course",
//             });
//         }
//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:"Student is already enrolled",
//             })
//         }
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
//     //order create
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount:amount*100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         //console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         })
//     }
//     catch(err){
//         //console.log(err);
//         res.json({
//             success:false,
//             message:"Could not intiate order"
//         })
//     }
// };

//verify signature of razorpay and server
// exports.verifySignature = async(req,res)=>{
//     const webhookSecret = "12345678";

//     const signature = req.headers("x-razorpay-signature");

//     //three steps
//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     //compare digest and signature
//     if(signature===digest){
//         //console.log("Payment is authorized");

//         const{courseId,userId} = req.body.payload.payment.entity.notes;

//         try{
//             //fulfil the action
//             //find the course and enroll the student in the course
//             const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId},{
//                 $push:{
//                     studentEnrolled:userId
//                 }
//             },{new:true});

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course not found",
//                 })
//             }

//             //console.log(enrolledCourse);

//             //find the student
//             const enrolledStudent = await User.findOneAndUpdate({_id:userId},{
//                 $push:{
//                     courses:courseId
//                 }
//             },{new:true})

//             //console.log(enrolledStudent);

//             //mail send krdo confirmation wala
//             const emailResponse = await mailSender(enrolledStudent.email,"Congratulations from CodeKing","Congratulations , you are onboard into new CodeKing course");

//             //console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and Course added"
//             })
//         }
//         catch(error){
//             //console.log(error);
//             return res.status().json({
//                 success:false,
//                 message:error.message,
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request",
//         })
//     }
// };
