import React from 'react'

const stats = [
    {count:"5K",countInfo:"Active Students"},
    {count:"10+",countInfo:"Mentors"},
    {count:"200+",countInfo:"Courses"},
    {count:"50+",countInfo:"Awards"},
]



const Stats = () => {
  return (
    <div className='bg-richblack-700'>
            <div className='flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto'>
                <div className="grid grid-cols-2 md:grid-cols-4 text-center">
                    {
                        stats.map((data,index)=>{
                            return(
                                <div key={index} className='flex flex-col py-10'>
                                    <h1 className="text-[30px] font-bold text-richblack-5">{data.count}</h1>
                                    <h2 className="font-semibold text-[16px] text-richblack-500">{data.countInfo}</h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
    </div>
  )
}

export default Stats
