import { axiosInstance } from "../../api/axios";

export const getAllSubCategoryMeta = async (subCategoryMetaId) => {
    const response = await axiosInstance.get(`/sub-category-metas/${subCategoryMetaId}`);
    return response.data;
}

export const createSubCategoryMeta = async (subCategoryMetaId, subCategoryMetaParams) => {
    const response = await axiosInstance.post(`/sub-category-metas/${subCategoryMetaId}`, subCategoryMetaParams);
    return response.data;
}

// export const deleteSubCategoryMeta = async (id) => {
//     const response = await axiosInstance.delete(`/sub-category-metas/${id}`,);
//     return response.data;
// }

export const editSubCategorysMeta = async (subCategoryMetaId, editSubCategoryMetaParams) => {
    const response = await axiosInstance.put(`/sub-category-metas/${subCategoryMetaId}`, editSubCategoryMetaParams);
    return response.data;
}

// export const editStatusSubCategoryMeta = async (productId, status) => {
//     const response = await axiosInstance.put(`/sub-category-metas/sub-category-status/${productId}?status=${status}`);
//     return response.data;
// }