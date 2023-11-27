import { axiosInstance } from "../../api/axios";

export const getAllImportReceipt = async () => {
    const response = await axiosInstance.get(`/import-request-receipts`);
    return response.data;
}

export const createImportReceipt = async (recieptParams) => {
    const response = await axiosInstance.post(`/import-request-receipts`, recieptParams);
    return response.data;
}