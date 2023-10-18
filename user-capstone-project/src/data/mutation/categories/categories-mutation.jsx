import { axiosInstance } from "../../api/axios";

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
}

export const createCategories = async (categoriesParams) => {
    const response = await axiosInstance.post("/categories", categoriesParams);
    return response.data;
}
export const deleteCategories = async (id) => {
    const response = await axiosInstance.delete(`/units/${id}`,);
    return response.data;
}
