import { axiosInstance } from "../../api/axios";

export const getAllOrigins = async () => {
    const response = await axiosInstance.get("/origins");
    return response.data;
}

export const createOrigins = async (originParams) => {
    const response = await axiosInstance.post("/origins", originParams);
    return response.data;
}

export const deleteOrigins = async (id) => {
    const response = await axiosInstance.delete(`/origins/${id}`, );
    return response.data;
}

export const editOrigins = async (originsId, editOriginsParams) => {
    const response = await axiosInstance.put(`/origins/${originsId}`, editOriginsParams);
    return response.data;
}

