import { axiosInstance } from "../../api/axios";

export const getItemsByMovementsHistory = async (itemId) => {
    const response = await axiosInstance.get(`/item-movements?id=${itemId}`);
    return response.data;
}

export const createItemMovements = async (productParams) => {
    const response = await axiosInstance.post("/item-movements", productParams);
    return response.data;
}