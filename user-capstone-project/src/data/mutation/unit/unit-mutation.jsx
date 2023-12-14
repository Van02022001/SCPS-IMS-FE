import { axiosInstance } from "../../api/axios";

export const getAllUnit = async () => {
    const response = await axiosInstance.get("/units");
    return response.data;
}

export const getAllUnitMeasurement = async () => {
    const response = await axiosInstance.get("/units-measurement");
    return response.data;
}

export const createUnits = async (unitParams) => {
    const response = await axiosInstance.post("/units", unitParams);
    return response.data;
}

export const editUnits = async (id, unitParams) => {
    const response = await axiosInstance.put(`/units/${id}`, unitParams);
    return response.data;
}
