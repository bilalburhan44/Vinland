import { axiosInstance } from "./axiosinstance";

export const convertCurrency = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/conversion/convertCurrency', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};
