import {axiosInstance} from "./axiosinstance";

export const getWallet = async () => {
    try {
        const response = await axiosInstance.get('/api/wallet/getTotalAmount');
        return response.data;
    } catch (error) {
        return error.message;
    }
}