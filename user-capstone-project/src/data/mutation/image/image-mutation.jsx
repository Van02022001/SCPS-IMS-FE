import { imageInstance, axiosInstance } from "../../api/axios";



export const uploadImageSubcategory = async (scId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scId', scId);

    try {
        const response = await imageInstance.post(`/images/subcategory/${scId}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const getAllImageSubcategory = async (scId) => {
    const response = await axiosInstance.get(`/images/subcategory/${scId}`);
    return response.data;
}