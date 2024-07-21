import { axiosInstance } from "./axiosinstance";

export const getClientById = async() => {
    try {
      const response = await axiosInstance.get('/api/clients/getClientById');
      return response.data;
    } catch (error) {
      return error.message;
    }
  };

  export const addClient = async(payload) => {
    try {
      const response = await axiosInstance.post('/api/clients/addClient', payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

export const getAllClients = async() => {
    try {
      const response = await axiosInstance.get('/api/clients/getAllClients');
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

export const deleteClient = async(id) => {
    try {
      const response = await axiosInstance.delete(`/api/clients/deleteClient/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

  export const updateClient = async(id, payload) => {
    try {
      const response = await axiosInstance.put(`/api/clients/updateClient/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }