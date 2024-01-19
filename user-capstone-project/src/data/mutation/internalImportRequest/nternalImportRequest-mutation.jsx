import { axiosInstance } from "../../api/axios";

export const getAllInternalImportRequest = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import-request`);
    return response.data;
}

export const createInternalImportRequest = async (recieptParams) => {
    const response = await axiosInstance.post(`/transfer-warehouses/internal-import-request`, recieptParams);
    return response.data;
}