import { axiosInstance } from "../../api/axios";

export const createImportReceipt = async (receiptId, recieptParams) => {
    const response = await axiosInstance.post(`/import-receipts/create-import/${receiptId}`, recieptParams);
    return response.data;
}
