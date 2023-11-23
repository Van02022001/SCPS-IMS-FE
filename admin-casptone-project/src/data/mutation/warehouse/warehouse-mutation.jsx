import { axiosInstance } from "../../api/axios";

export const getAllWarehouse = async () => {
    const response = await axiosInstance.get("/warehouses");
    return response.data;
}