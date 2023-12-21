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

export const editWarehouse = async (categoryId, editWarehouseParams) => {
    const response = await axiosInstance.put(`/warehouses${categoryId}`, editWarehouseParams);
    return response.data;
}

// export const editStatusWarehouse = async (categoryId, status) => {
//     const response = await axiosInstance.put(`/warehouses${categoryId}`, editWarehouseParams);
//     return response.data;
// }
export const getWarehouseSearch = async (keyWordWarehouse) => {
    const response = await axiosInstance.get(`/warehouses/search?keyword=${keyWordWarehouse}`);
    return response.data;
}

export const getInventoryStaffByWarehouseId = async (warehouseId) => {
    const response = await axiosInstance.get(`/warehouses/inventory-staffs/${warehouseId}`);
    return response.data;
};

export const getOtherWarehouse = async () => {
    const response = await axiosInstance.get("/warehouses/other-warehouses");
    return response.data;
}