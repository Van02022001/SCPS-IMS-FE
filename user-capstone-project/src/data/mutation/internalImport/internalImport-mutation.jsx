import { axiosInstance } from "../../api/axios";

export const getAllInternalImport = async () => {
    const response = await axiosInstance.get(`/transfer-warehouses/internal-import`);
    return response.data;
}
