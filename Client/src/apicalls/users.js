import { axiosInstance } from "./axiosinstance";


//Register
export const RegisterUser = async(payload) => {
    try {
      const response = await axiosInstance.post('/api/users/authentication/sign-up', payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  };
  
  //Login
  export const LoginUser = async(payload) => {
    try {
      const response = await axiosInstance.post('/api/users/authentication/sign-in', payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  };
  
  //get current user
  export const getCurrentUser = async() => {
    try {
      const response = await axiosInstance.get('/api/users/get-current-user');
      return response.data;
    } catch (error) {

      return error.message;
    }
  };

  //get user name 
  export const getUserById = async() => {
    try {
      const response = await axiosInstance.get('/api/users/getUserById');
      return response.data;
    } catch (error) {
      return error.message;
    }
  };
  