import { axiosInstance } from "../../api/axios";

export const getAllLocation = async () => {
    const response = await axiosInstance.get(`/locations`);
    return response.data;
}