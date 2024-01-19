import { axiosInstance } from "../../api/axios";

export const getAllInternalExport = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-export`);
    return response.data;
}

export const createInternalExportReceipt = async (receiptId, recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-export/${receiptId}`, recieptParams);
    return response.data;
}
