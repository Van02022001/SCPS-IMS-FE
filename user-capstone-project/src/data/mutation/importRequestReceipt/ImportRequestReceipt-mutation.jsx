import { axiosInstance } from "../../api/axios";

export const getAllImportReceipt = async () => {
    const response = await axiosInstance.get(`/import-request-receipts`);
    return response.data;
}

export const createImportRequestReceipt = async (recieptParams) => {
    const response = await axiosInstance.post(`/import-request-receipts`, recieptParams);
    return response.data;
}

export const editImportReceipt = async (importReceiptId, editImportReceiptParams) => {
    const response = await axiosInstance.put(`/import-request-receipts/${importReceiptId}`, editImportReceiptParams);
    return response.data;
}

export const editImportReceiptConfirm = async (importReceiptId) => {
    const response = await axiosInstance.put(`/import-request-receipts/confirm/${importReceiptId}`);
    return response.data;
}

export const editReceiptStartImport = async (importReceiptId) => {
    const response = await axiosInstance.put(`/import-request-receipts/${importReceiptId}/start-import`);
    return response.data;
}