import { axiosInstance } from "../../api/axios";

export const getAllOrigins = async () => {
    const response = await axiosInstance.get("/origins");
    return response.data;
}

export const createOrigins = async (originParams) => {
    const response = await axiosInstance.post("/origins", originParams);
    return response.data;
}