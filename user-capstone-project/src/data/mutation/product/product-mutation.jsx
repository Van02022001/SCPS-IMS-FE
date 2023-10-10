import { axiosInstance } from "../../api/axios";

export const getAllProduct = async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
}

export const createProduct = async (productParams) => {
    const response = await axiosInstance.post("/products", productParams);
    return response.data;
}
