import { axiosInstance } from "../../api/axios";

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
}

export const createCategories = async (categoriesParams) => {
    const response = await axiosInstance.post("/categories", categoriesParams);
    return response;
}
export const deleteCategories = async (id) => {
    const response = await axiosInstance.delete(`/units/${id}`,);
    return response.data;
}

export const editCategories = async (categoriesId, editCategoriesParams) => {
    const response = await axiosInstance.put(`/categories/${categoriesId}`, editCategoriesParams);
    return response.data;
}
export const editStatusCategories = async (categoriesId, status) => {
    const response = await axiosInstance.put(`/categories/category-status/${categoriesId}?status=${status}`);
    return response.data;
}