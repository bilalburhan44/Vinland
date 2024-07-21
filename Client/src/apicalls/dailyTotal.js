// apicalls/dailyTotal.js

import { axiosInstance } from "./axiosinstance";

export const getDailyTotal = async () => {
    try {
        const response = await axiosInstance.get('/api/dailyTotal/getDailyTotal');
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const updateDailyNote = async (date, noteData) => {
    try {
        const response = await axiosInstance.put('/api/dailyTotal/updateDailyNote', {
            date,
            note: noteData.note
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const deleteDailyNote = async (date) => {
    try {
        const response = await axiosInstance.put(`/api/dailyTotal/deleteDailyNote`, { date });
        return response.data;
    } catch (error) {
        return error.message;
    }
}
