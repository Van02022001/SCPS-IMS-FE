import { axiosInstance } from "../../api/axios";

export const getAllCustomer = async () => {
    const response = await axiosInstance.get("/customers");
    return response.data;
}

export const createCustomer = async (customerParams) => {
    const response = await axiosInstance.post("/customers", customerParams);
    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/origins/${id}`,);
    return response.data;
}

export const editProduct = async (productId, editProductParams) => {
    const response = await axiosInstance.put(`/products/${productId}`, editProductParams);
    return response.data;
}

export const editStatusProduct = async (productId, status) => {
    const response = await axiosInstance.put(`/products/product-status/${productId}?status=${status}`);
    return response.data;
}