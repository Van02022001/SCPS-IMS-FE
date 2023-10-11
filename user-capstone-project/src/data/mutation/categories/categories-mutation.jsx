import { axiosInstance } from "../../api/axios";

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
}

export const createCategories = async (categoriesParams) => {
    const response = await axiosInstance.post("/categories", categoriesParams);
    return response.data;
}