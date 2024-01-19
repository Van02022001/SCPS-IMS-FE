import { axiosInstance } from "../../api/axios";

export const getAllInternalExportRequest = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-export-request`);
    return response.data;
}

export const createInternalExportRequest = async (recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-export-request`, recieptParams);
    return response.data;
}