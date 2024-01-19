import { axiosInstance } from "../../api/axios";

export const getAllItem = async () => {
    const response = await axiosInstance.get("/items");
    return response.data;
}

export const getItemByWarehouse = async () => {
    const response = await axiosInstance.get(`/items/items-by-warehouse`);
    return response.data;
}

export const getItemByWarehouseId = async (warehouseId) => {
    const response = await axiosInstance.get(`/items/items-by-warehouse/${warehouseId}`);
    return response.data;
}

export const createItem = async (itemParams) => {
    const response = await axiosInstance.post("/items", itemParams);
    return response.data;
}

// export const deleteItem = async (id) => {
//     const response = await axiosInstance.delete(`/origins/${id}`,);
//     return response.data;
// }

export const editItem = async (itemId, editItemParams) => {
    const response = await axiosInstance.put(`/items/${itemId}`, editItemParams);
    return response.data;
}

export const editStatusItem = async (itemId, status) => {
    const response = await axiosInstance.put(`/items/item-status/${itemId}?status=${status}`);
    return response.data;
}

export const getItemsBySubCategory = async (itemId) => {
    const response = await axiosInstance.get(`/items/items-by-sub-category/${itemId}`);
    return response.data;
}
export const getItemsByPriceHistory = async (itemId) => {
    const response = await axiosInstance.get(`/items/purchase-price-history/${itemId}`);
    return response.data;
}

export const getItemsByPricingHistory = async (itemId) => {
    const response = await axiosInstance.get(`/items/pricing-history/${itemId}`);
    return response.data;
}

export const getExaminationItem = async (receiptId) => {
    const response = await axiosInstance.get(`/items/item-locations/${receiptId}`);
    return response.data;
}

export const editItemLocations = async (itemId, editLocationsParams) => {
    const response = await axiosInstance.put(`/items/item-locations/${itemId}`, editLocationsParams);
    return response.data;
}
export const editItemLocationsExport = async (editLocationsExportParams) => {
    const response = await axiosInstance.put(`/items/item-locations/warehouse-export`, editLocationsExportParams);
    return response.data;
}
// export const getAllItemBySale = async (warehouseId) => {
//     const response = await axiosInstance.get(`/items/items-by-warehouse/sale-staff/${warehouseId}`);
//     return response.data;
// }
export const getAllItemBySale = async (warehouseId) => {
    const response = await axiosInstance.get(`/items/warehouse-inventory/${warehouseId}`);
    return response.data;
}
export const getUpdatedLocationDetails = async (receiptId) => {
    const response = await axiosInstance.get(`/items/item-locations/receitp-detail/${receiptId}`);
    return response.data;
}
export const getItemsByName = async (itemId) => {
    const response = await axiosInstance.get(`/items/name/${itemId}`);
    return response.data;
}