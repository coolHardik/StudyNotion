const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;
  try {
    //check if subsection is valid
    const subSection = await SubSection.findById(subsectionId);
    if (!subSection) {
      return res.status(404).json({
        error: "Invalid SubSection",
      });
    }
    //console.log("Sub vaidaiiotj done1",subSection);
    //check for old entry
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });
    //console.log("mama",courseProgress);
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course Progress does not exist",
      });
    } else {
      //console.log("Sub vaidaiiotj done2");
      //check for re-completing video/subSection
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({
          error: "SubSection is already completed",
        });
      }
      //push into completed course
      courseProgress.completedVideos.push(subsectionId);
      //console.log("Sub vaidaiiotj done3");
    }
    await courseProgress.save();
    //console.log("Sub vaidaiiotj done4");
    return res.status(200).json({
       message: "Course progress updated" 
      });
  } catch (err) {
    //console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
