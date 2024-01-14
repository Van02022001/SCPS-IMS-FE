import { axiosInstance } from "../../api/axios";

export const getAllImportReceipt = async () => {
    const response = await axiosInstance.get(`/import-receipts`);
    return response.data;
}

export const createImportReceipt = async (receiptId, recieptParams) => {
    const response = await axiosInstance.post(`/import-receipts/create-import/${receiptId}`, recieptParams);
    return response.data;
}
export const getAllImportReceiptByWarehouse = async () => {
    const response = await axiosInstance.get(`/import-receipts/warehouse`);
    return response.data;
}
