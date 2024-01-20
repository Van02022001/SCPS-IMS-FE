import { axiosInstance } from "../../api/axios";

export const getAllExportReceipt = async () => {
    const response = await axiosInstance.get(`/export-receipts`);
    return response.data;
}

export const getAllExportReceiptWarehouse = async () => {
    const response = await axiosInstance.get(`/export-receipts/warehouse`);
    return response.data;
}

export const createExportReceipt = async (receiptId, recieptParams) => {
    const response = await axiosInstance.post(`/export-receipts/${receiptId}`, recieptParams);
    return response.data;
}
