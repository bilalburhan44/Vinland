import { axiosInstance } from "./axiosinstance";


export const getExchangeRate = async () => {
  try {
    const response = await axiosInstance.get('/api/exchangeRate/getExchangeRate');
    return response.data;
  } catch (error) {
    return error.message;
  }
}

