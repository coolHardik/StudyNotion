const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionName,courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //create Section
        const newSection = await Section.create({
            sectionName
        });
        //update Course with Section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id,
            }
        },{new:true}).populate({path: "courseContent",populate: {path: "subSection",},}).exec();                     
        //use populate to replace Section and SubSection both in the updated course details
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            updatedCourseDetails,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create section please try again",
            error:err.message
        })
    }
}

//updateSection
exports.updateSection = async(req,res)=>{
    try{
        //data input
        const {sectionName,sectionId,courseId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //update Data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        const course = await Course.findById(courseId).populate({path:"courseContent" , populate:{path:"subSection"} , }).exec();
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            data:course,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create section please try again",
            error:err.message
        })
    }
}


//delete Section
exports.deleteSection = async (req, res) => {
	try {
		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {$pull: {courseContent: sectionId,}})                 

		const section = await Section.findById(sectionId);
		if(!section) {
			return res.status(404).json({success:false, message:"Section not Found",})	 
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});
        
		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({                               //here there is no use of const course , its only store updated course;
			path:"courseContent",                                                               // if you also write without  "const course = " then it also work;
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted successfully",
			data:course
		});
	} 
    catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};