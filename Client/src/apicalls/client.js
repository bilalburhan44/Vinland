import { axiosInstance } from "./axiosinstance";

  // add client
  export const addClient = async(payload) => {
    try {
      const response = await axiosInstance.post('/api/clients/addClient', payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

//get all client
export const getAllClients = async() => {
    try {
      const response = await axiosInstance.get('/api/clients/getAllClients');
      return response.data;
    } catch (error) {
      return error.message;
    }
  }


// get client by id
  export const getClient = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/clients/getClient/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
}


//delete client by id
export const deleteClient = async(id) => {
    try {
      const response = await axiosInstance.delete(`/api/clients/deleteClient/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

  //update client
  export const updateClient = async(id, payload) => {
    try {
      const response = await axiosInstance.put(`/api/clients/updateClient/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }