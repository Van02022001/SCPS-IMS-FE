import { axiosInstance } from "../../api/axios";

export const getAllInventoryCheck = async () => {
    const response = await axiosInstance.get(`/inventory-checks/receipts`);
    return response.data;
}

export const createInventoryCheck = async (InventoryCheckParams) => {
    const response = await axiosInstance.post(`/inventory-checks`, InventoryCheckParams);
    return response.data;
}

export const confirmInventoryCheck = async (receiptId) => {
    const response = await axiosInstance.put(`/inventory-checks/confirm/${receiptId}`);
    return response.data;
}
