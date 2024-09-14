import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from '../../../components/common/RatingStars'
import  getAverageRating  from '../../../utils/avgRating'


const Course_Card = ({course,Height}) => {
    const [avgReviewCount,setAvgReviewCount] = useState(0);
    //console.log("course ahdik",course.ratingAndReviews);
    useEffect(()=>{
        const count = getAverageRating(course.ratingAndReviews)
        setAvgReviewCount(count);
    },[course])
    //console.log("friend",course);
  return (
    <div>
      <Link to={`/courses/${course._id}`}>
            <div>
                <div className="rounded-lg">
                    <img src={course?.thumbnail} alt="CourseThumbnail"
                        className={`${Height} w-full rounded-xl object-cover `}  
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{course?.instructor?.firstName}{" "}{course?.instructor?.lastName}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{avgReviewCount}</span>
                        <RatingStars Review_Count={avgReviewCount}/>
                        <span className="text-white">{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5">₹ {course?.price}</p>
                </div>
            </div>
      </Link>
    </div>
  );
};

export default Course_Card;
