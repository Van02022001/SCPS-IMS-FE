import { axiosInstance } from "../../api/axios";

export const getAllImportRequest = async () => {
    const response = await axiosInstance.get(`/import-request-receipts`);
    return response.data;
}

export const createImportRequestReceipt = async (recieptParams) => {
    const response = await axiosInstance.post(`/import-request-receipts`, recieptParams);
    return response.data;
}

export const getImportRequestById = async (importReceiptId) => {
    const response = await axiosInstance.get(`import-request-receipts/${importReceiptId}`);
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

export const getAllImportRequestOfWarehouse = async () => {
    const response = await axiosInstance.get(`/import-request-receipts/warehouse`);
    return response.data;
}