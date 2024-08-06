import { axiosInstance } from "./axiosinstance";

//add project
export const addProject = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/projects/addProject', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

// get project by client id
export const getProject = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/projects/getProject/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

// get project by transaction id
export const getTransactionProject = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/projects/getTransactionProject/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//get all project
export const getAllProjects = async () => {
    try {
        const response = await axiosInstance.get('/api/projects/getAllProjects')
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//update project
export const updateProject = async(id, payload) => {
    try {
      const response = await axiosInstance.put(`/api/projects/updateProject/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

//delete project
export const deleteProject = async(id) => {
    try {
      const response = await axiosInstance.delete(`/api/projects/deleteProject/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }