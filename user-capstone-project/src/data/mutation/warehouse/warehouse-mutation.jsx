import { axiosInstance } from "../../api/axios";

export const getAllWarehouse = async () => {
    const response = await axiosInstance.get("/warehouses");
    return response.data;
}

export const createWarehouse = async (warehouseParams) => {
    const response = await axiosInstance.post("/warehouses", warehouseParams);
    return response.data;
}

export const deleteWarehouse = async (id) => {
    const response = await axiosInstance.delete(`/units/${id}`,);
    return response.data;
}
