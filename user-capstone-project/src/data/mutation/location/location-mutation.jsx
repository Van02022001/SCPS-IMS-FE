import { axiosInstance } from "../../api/axios";

export const getAllLocation = async () => {
    const response = await axiosInstance.get(`/locations`);
    return response.data;
}

export const createLocations = async (locationParams) => {
    const response = await axiosInstance.post("/locations", locationParams);
    return response.data;
}

export const editLocations = async (locationsId, editLocationsParams) => {
    const response = await axiosInstance.put(`/locations/${locationsId}`, editLocationsParams);
    return response.data;
}

export const getAllLocationByItem = async (itemId) => {
    const response = await axiosInstance.get(`/locations/locations-by-item/${itemId}`);
    return response.data;
}