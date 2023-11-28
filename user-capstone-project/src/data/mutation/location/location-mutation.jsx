import { axiosInstance } from "../../api/axios";

export const getAllLocation = async () => {
    const response = await axiosInstance.get(`/locations`);
    return response.data;
}

export const getAllLocationByItem = async (itemId) => {
    const response = await axiosInstance.get(`/locations/locations-by-item/${itemId}`);
    return response.data;
}