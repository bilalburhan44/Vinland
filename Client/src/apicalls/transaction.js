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
export const getTransactions = async () => {
    try {
        const response = await axiosInstance.get('/api/transactions/getTransactions');
        return response.data;
      } catch (error) {
        return error.message;
      }
    }
