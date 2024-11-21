import { commonAPI } from "./commonAPI";
import {SERVER_URL} from "./server_url"


  
  

 // viewgrievance
export const viewAllGrievanceAPI = async()=>{
  return await commonAPI("GET",`${SERVER_URL}/viewgrievance`,"")
}
// updateGrievanceStatusAPI
export const updateGrievanceStatusAPI = async (complaintId, status) => {
  return await commonAPI("PUT", `${SERVER_URL}/updategrievancestatus/${complaintId}/status`,  status );
};

export const adminLoginAPI = async(reqBody)=>
  {
      return await commonAPI("POST",`${SERVER_URL}/adminlogin`,reqBody)
  }


// viewGrievanceByUserIDAPI
  