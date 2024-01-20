import { axiosInstance } from "../../api/axios";

export const getAllInternalImportRequest = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import-request`);
    return response.data;
}

export const createInternalImportRequest = async (recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-import-request`, recieptParams);
    return response.data;
}

export const getAllInternalImportRequestOfWarehouse = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import-request/warehouse`);
    return response.data;
}

export const editInternalImportReceiptConfirm = async (importReceiptId) => {
    const response = await axiosInstance.put(`/transfer-warehouses/internal-import-request/confirm/${importReceiptId}`);
    return response.data;
}

export const getAllInternalImportWarehouse = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import/warehouse`);
    return response.data;
}

export const editReceiptStartInternalImport = async (importReceiptId) => {
    const response = await axiosInstance.put(`/transfer-warehouses/internal-import/processing/${importReceiptId}`);
    return response.data;
}