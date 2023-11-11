import { axiosInstance } from "../../api/axios";

export const getAllItem = async () => {
    const response = await axiosInstance.get("/items");
    return response.data;
}

export const createItem = async (itemParams) => {
    const response = await axiosInstance.post("/items", itemParams);
    return response.data;
}

export const deleteItem = async (id) => {
    const response = await axiosInstance.delete(`/origins/${id}`,);
    return response.data;
}

export const editItem = async (itemId, editItemParams) => {
    const response = await axiosInstance.put(`/items/${itemId}`, editItemParams);
    return response.data;
}

export const editStatusItem = async (itemId, status) => {
    const response = await axiosInstance.put(`/items/item-status/${itemId}?status=${status}`);
    return response.data;
}