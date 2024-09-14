const express = require("express");
const router = express.Router();

// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;

const { auth, isInstructor } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount); // Delet User Account
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/instructorDashboard", auth, isInstructor,instructorDashboard);
router.get("/getEnrolledCourses", auth, getEnrolledCourses); // Get Enrolled Courses
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.delete('/remove-profile-picture',auth, updateDisplayPicture);

module.exports = router;
