import { axiosInstance } from "../../api/axios";

export const getAllProduct = async () => {
    const response = await axiosInstance.get("/sub-categories");
    return response.data;
}

export const createProduct = async (productParams) => {
    const response = await axiosInstance.post("/sub-categories", productParams);
    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/origins/${id}`,);
    return response.data;
}

export const editProduct = async (productId, editProductParams) => {
    const response = await axiosInstance.put(`/sub-categories/${productId}`, editProductParams);
    return response.data;
}

export const editStatusProduct = async (productId, status) => {
    const response = await axiosInstance.put(`/sub-categories/sub-category-status/${productId}?status=${status}`);
    return response.data;
}