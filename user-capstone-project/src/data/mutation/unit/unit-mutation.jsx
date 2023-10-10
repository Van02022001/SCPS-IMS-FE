import { axiosInstance } from "../../api/axios";

export const getAllUnit = async () => {
    const response = await axiosInstance.get("/units");
    return response.data;
}

export const getAllUnitMeasurement = async () => {
    const response = await axiosInstance.get("/units-measurement");
    return response.data;
}