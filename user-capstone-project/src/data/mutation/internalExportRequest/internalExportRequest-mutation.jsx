import { axiosInstance } from "../../api/axios";

export const getAllInternalExportRequest = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-export-request`);
    return response.data;
}

export const createInternalExportRequest = async (recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-export-request`, recieptParams);
    return response.data;
}
export const editInternalExportReceiptConfirm = async (importReceiptId) => {
    const response = await axiosInstance.put(`/transfer-warehouses/internal-export-request/confirm/${importReceiptId}`);
    return response.data;
}

export const editReceiptStartInternalExport = async (importReceiptId) => {
    const response = await axiosInstance.put(`/transfer-warehouses/internal-export/processing/${importReceiptId}`);
    return response.data;
}
export const getAllInternalExportWarehouse = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-export/warehouse`);
    return response.data;
}

export const getInternalExportRequestForInventory = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-export-request/warehouse`);
    return response.data;
}