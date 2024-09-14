import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from '../../../../slices/cartSlice';
import getAverageRating from '../../../../utils/avgRating'
import RatingStars from '../../../common/RatingStars';

const RenderCartCourses = () => {
  const {cart} = useSelector((state)=>state.cart);
  //console.log("cart",cart);
  const dispatch = useDispatch();

  return (
    <div className='flex flex-1 flex-col'>
    {
        cart.map((course,index)=>{
            return(
                <div key={index} className={`flex w-full flex-wrap items-start justify-between gap-6 ${index !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"} ${index !== 0 && "mt-6"}`}>
                    <div className='flex flex-1 flex-col gap-4 xl:flex-row'>
                        <img src={course?.thumbnail} alt={course?.courseName}  className="h-[148px] w-[220px] rounded-lg object-cover"/>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-lg font-medium text-white'>{course?.couseName}</p>
                            <p className='text-sm text-white'>{course?.category?.name}</p>
                            <div className='flex items-center gap-2'>
                                <span className='text-yellow-5'>{getAverageRating(course?.ratingAndReviews)}</span>
                                <RatingStars
                                    Review_Count={getAverageRating(course?.ratingAndReviews)}
                                    size={20}
                                    edit={false}
                                    activeColor='#ffd700'
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                />
                                <span className='text-yellow-5'>{course?.ratingAndReviews?.length} Ratings</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-end space-y-2'>
                        <button onClick={()=>{
                            dispatch(removeFromCart(course._id))
                        }} className='flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200'>
                            <RiDeleteBin6Line />
                            <span>Remove</span>
                        </button>
                        <p className='mb-6 text-3xl font-medium text-yellow-100'>₹ {course?.price}</p>
                    </div>
                </div>
            )
        })
    }
    </div>
  )
}

export default RenderCartCourses
