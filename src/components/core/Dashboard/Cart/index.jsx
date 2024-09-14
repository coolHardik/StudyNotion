import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { resetCart } from "../../../../slices/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import IconBtn from "../../../common/IconBtn";
import { FiTrash } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Cart() {
  const { total, totalItems, cart } = useSelector((state) => state.cart);
  //console.log("sama", cart);
  const dispatch = useDispatch();
  const handleRemove = () => {
    toast.error("All courses removed from cart");
  };
  return (
    <div>
      <div className="mb-14 flex flex-row justify-between text-3xl font-medium text-richblack-5">
        <h1>Your Cart</h1>
        {cart.length ? (
          <button
            onClick={() => {
              dispatch(resetCart());
              handleRemove();
            }}
            className="flex flex-row items-center"
            title="Empty Cart"
          >
              <FiTrash className="text-richblack-900" />
          </button>
        ) : (
          ""
        )}
      </div>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-white">
        {
            totalItems>0?<p>{totalItems} Courses in cart</p>:<p></p>
        }
      </p>
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your cart is empty
        </p>
      )}
    </div>
  );
}
