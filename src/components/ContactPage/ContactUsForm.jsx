import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from '../../data/countrycode.json'
import toast from "react-hot-toast";

const ContactUsForm = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful},
  } = useForm();

  const submitContactForm = async (data) => {
    const toastId = toast.loading("Loading");
    //console.log("Logging Data",data);
    try{
      const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
      // const response = {status:"OK"};
      //console.log("Logging response",response);
      toast.success("Email Send Successsfully");
    }
    catch(err){
      //console.log("Error:",err.message);
      toast.error("Unable to send email check your data again");
    }
    toast.dismiss(toastId);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(
        {
          email: "",
          firstname: "",
          lastname: "",
          message: "",
          phoneNo: "",
        },
        [reset,isSubmitSuccessful]
      );
    }
  });

  return (
    <form onSubmit={handleSubmit(submitContactForm)} className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 lg:flex-row">
              {/* firstName */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstname" className="lable-style">First Name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter first name"
              className="form-style"
              {...register("firstname", { required: true })}
            />
            {errors.firstname && <span className="-mt-1 text-[12px] text-yellow-100">Please enter Your name</span>}
          </div>
          {/* lastName */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastname" className="lable-style">Last Name</label>
            <input
              type="text"
              name="lastname"
              className="form-style"
              id="lastname"
              placeholder="Enter last name"
              {...register("lastname")}
            />
          </div>
        </div>
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="lable-style">Email Address</label>
          <input
            type="email"
             className="text-black form-style"
            name="email"
            id="email"
            placeholder="Enter email Address"
            {...register("email", { required: true })}
          />
            {errors.email && <span className="-mt-1 text-[12px] text-yellow-100">Please enter Your Email Address</span>}
        </div>

        {/* PhoneNumber */}
        <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber"  className="lable-style">Phone Number</label>
            <div className="flex flex-row gap-5">
                  {/* DropDown */}
                  <div className="flex w-[80px] flex-col gap-2">
                  <select name="dropdown" id="dropdown" className="form-style" 
                    {...register("countrycode",{required:true})}>
                      {
                        CountryCode.map((element,index)=>{
                          return(
                            <option key={index} value={element.code}>
                              {element.code}-{element.country}
                            </option>
                          )
                        })
                      }
                    </select>
                  </div>
                 
                 <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                 <input 
                      type="number"
                      name="phonenumber"
                      id="phonenumber"
                      placeholder="12345 67890"
                      className="form-style"
                      {...register("phoneNo",{
                        required:{value:true,message:"Please Enter Phone Number"},
                        maxLength:{value:10,message:"Invalid Phone Number"},
                        minLength:{value:8,message:"Invalid Phone Number"},
                      })}
                    />
                 </div>
 
            </div>
            {
              errors.phoneNo && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.phoneNo.message}
                </span>
              )
            }
        </div>


        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message"  className="lable-style">Message</label>
          <textarea
            name="message"
            id="message"
            className=" form-style"
            cols="30"
            rows="7"
            placeholder="Enter Your message here"
            {...register("message", { required: true })}
          />
          {errors.message && <span className="-mt-1 text-[12px] text-yellow-100">Please enter your message</span>}
        </div>
        <button type='submit' className="rounded-md bg-yellow-50
        text-center px-6 text-[16px] font-bold text-black p-5 w-[50%] mx-auto">Send Message</button>
    </form>
  );
};

export default ContactUsForm;
