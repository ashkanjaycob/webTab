import { getCookie } from "../../utils/cookie";
import API from "../auth/authService";

const formioService = async () => {
    const Token = getCookie("userToken");
    try {
      const response = await API.get(
        `formio-file?fileId=2`,
        { 
          headers: {
            accept: "application/json",
            token: Token,  
            language: "en", 
          }
        }
      );
      return response;
    } catch (err) {
      console.error("Error while fetching BPMN data:", err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message ||"Error while fetching BPMN data:");
    }
  };
  

export default formioService;
