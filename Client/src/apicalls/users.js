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

  // get all users
  export const getAllUsers = async() => {
    try {
      const response = await axiosInstance.get('/api/users/getAllUsers');
      return response.data;
    } catch (error) {
      return error.message;
    }
  };

  // delete user
  export const deleteUser = async(id) => {
    try {
      const response = await axiosInstance.delete(`/api/users/deleteUser/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  };

  // update user
  export const updateUser = async(id, payload) => {
    try {
      const response = await axiosInstance.put(`/api/users/updateUser/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  };
  
