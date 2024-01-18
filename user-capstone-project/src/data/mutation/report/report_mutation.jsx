import { axiosInstance } from "../../api/axios";

export const getReports = async () => {
    const response = await axiosInstance.get(`/reports`);
    return response.data;
}

export const createReports = async (reportsParams) => {
    const response = await axiosInstance.post("/reports/receipts", reportsParams);
    return response.data;
}