import { getCookie } from "../../utils/cookie";
import API from "../auth/authService";

const fetchBpmnData = async () => {
  const Token = getCookie("userToken");
  try {
    const response = await API.get(
      `bpmn-file?fileId=2`,
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
    console.error("Error while fetching BPMN data:", err.response ? err.response.data.message : err.message);
    throw err;
  }
};

export default fetchBpmnData;
