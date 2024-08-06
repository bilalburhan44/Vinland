import { axiosInstance } from "./axiosinstance";


//add transaction
export const addTransaction = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/transactions/addTransaction', payload);
        return response.data;
      } catch (error) {
        return error.message;
      }
    };

// get transactions

export const getTransactions = async (filters = {}) => {
  try {
      const response = await axiosInstance.get('/api/transactions/getTransactions', { params: filters });
      return response.data;
  } catch (error) {
      return { success: false, message: error.message };
  }
};

// delete transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/transactions/deleteTransaction/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message }; // Properly return error
  }
};

// update transaction
export const updateTransaction = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/api/transactions/updateTransaction/${id}`, payload);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message }; // Properly return error
  }
};

// get transaction by id
export const getTransaction = async (clientId, projectId) => {
  try {
      const response = await axiosInstance.get(`/api/transactions/getTransaction/${clientId}/${projectId}`);
      return response.data;
  } catch (error) {
      return error.message;
  }
}
