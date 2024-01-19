import { axiosInstance } from "../../api/axios";

export const getAllInternalImport = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import`);
    return response.data;
}

export const createInternalImportReceipt = async (receiptId, recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-import/${receiptId}`, recieptParams);
    return response.data;
}
