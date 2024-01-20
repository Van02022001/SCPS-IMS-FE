import { axiosInstance } from "../../api/axios";

export const getAllInventoryReport = async () => {
    const response = await axiosInstance.get(`/inventories/summary-by-item`);
    return response.data;
}

export const getAllInventoryByItems = async () => {
    const response = await axiosInstance.get(`/inventories/current-warehouse`);
    return response.data;
}

export const getAllInventoryByWarehouse = async (warehouseId) => {
    const response = await axiosInstance.get(`/inventories/warehouse/${warehouseId}`);
    return response.data;
}
