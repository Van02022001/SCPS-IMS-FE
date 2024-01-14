import { axiosInstance } from "../../api/axios";

export const getAllLocation_tag = async () => {
    const response = await axiosInstance.get(`/location-tags`);
    return response.data;
}

export const createLocations_tag = async (locationParams) => {
    const response = await axiosInstance.post("/location-tags", locationParams);
    return response.data;
}
