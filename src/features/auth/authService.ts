import API from '../../configs/apiInstance'; 

export const login = async (data: { email: string; password: string }) => {
  return API.post('/auth-login', data);
};
export const register = async (data: { email: string; password: string }) => {
  return API.post('/auth-register', data);
};


export default API;
