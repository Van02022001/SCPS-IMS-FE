import { axiosInstance } from "../../api/axios";

export const getAllSuppliers = async () => {
    const response = await axiosInstance.get("/suppliers");
    return response.data;
}

export const createSuppliers = async (originParams) => {
    const response = await axiosInstance.post("/suppliers", originParams);
    return response.data;
}

export const deleteSuppliers = async (id) => {
    const response = await axiosInstance.delete(`/suppliers/${id}`, );
    return response.data;
}

export const editSuppliers = async (suppliersId, editSuppliersParams) => {
    const response = await axiosInstance.put(`/suppliers/${suppliersId}`, editSuppliersParams);
    return response.data;
}
export const editStatusSuppliers = async (suppliersId, status) => {
    const response = await axiosInstance.put(`/suppliers/status/${suppliersId}?status=${status}`);
    return response.data;
}

