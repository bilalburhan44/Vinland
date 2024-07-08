import { axiosInstance } from "./axiosinstance";

export const getClientById = async() => {
    try {
      const response = await axiosInstance.get('/api/clients/getClientById');
      return response.data;
    } catch (error) {
      return error.message;
    }
  };