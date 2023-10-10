import { axiosInstance } from "../../api/axios";

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories/getAllCategory");
    return response.data;
}

export const createCategories = async (categoriesParams) => {
    const response = await axiosInstance.post("/categories/createCategory", categoriesParams);
    return response.data;
}
    