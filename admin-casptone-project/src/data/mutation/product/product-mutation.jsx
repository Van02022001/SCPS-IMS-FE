import { axiosInstance } from "../../api/axios";

export const getAllProducts = async () => {
    const response = await axiosInstance.get("/products/getAllProduct");
    return response.data;
}