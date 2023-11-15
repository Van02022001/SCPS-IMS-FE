import { axiosInstance } from "../../api/axios";

export const getAllSubCategory = async () => {
    const response = await axiosInstance.get("/sub-categories");
    return response.data;
}
export const getAllSubCategoryActive = async () => {
    const response = await axiosInstance.get("/sub-categories/active-sub-category");
    return response.data;
}

export const getSubCategoryByName = async (keyWordSubCategory) => {
    const response = await axiosInstance.get(`/sub-categories/search?keyword=${keyWordSubCategory}`);
    return response.data;
}


export const createSubCategory = async (productParams) => {
    const response = await axiosInstance.post("/sub-categories", productParams);
    return response.data;
}

export const deleteSubCategory = async (id) => {
    const response = await axiosInstance.delete(`/origins/${id}`,);
    return response.data;
}

export const editSubCategory = async (categoryId, editCategoryParams) => {
    const response = await axiosInstance.put(`/sub-categories/${categoryId}`, editCategoryParams);
    return response.data;
}

export const editStatusCategory = async (categoryId, status) => {
    const response = await axiosInstance.put(`/sub-categories/sub-category-status/${categoryId}?status=${status}`);
    return response.data;
}