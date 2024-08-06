import { axiosInstance } from "./axiosinstance";


export const getExchangeRate = async () => {
  try {
    const response = await axiosInstance.get("/api/exchangeRate/getExchangeRate");
    return response.data;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return { success: false, message: error.message };
  }
};

export const addExchangeRate = async (data) => {
  try {
    const response = await axiosInstance.post("/api/exchangeRate/addExchangeRate", data);
    return response.data;
  } catch (error) {
    console.error("Error adding exchange rate:", error);
    return { success: false, message: error.message };
  }
};

