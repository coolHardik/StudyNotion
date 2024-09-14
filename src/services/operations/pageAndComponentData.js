import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from "../apis";


export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{
      categoryId:categoryId,
    });
    if(!response.data.success){
        throw new Error("Could not fetch Category data");
    }
     result = response?.data;
    //  //console.log(result);
  }catch(err){
    //console.log("Catalog page data API Error",err);
    toast.error(err.message);
    result = err.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

 