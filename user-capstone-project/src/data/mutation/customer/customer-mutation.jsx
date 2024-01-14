import { axiosInstance } from "../../api/axios";

export const getAllCustomer = async () => {
    const response = await axiosInstance.get("/customers");
    return response.data;
}

export const createCustomer = async (customerParams) => {
    const response = await axiosInstance.post("/customers", customerParams);
    return response.data;
}

export const editStatusCustomer = async (id) => {
    const response = await axiosInstance.put(`/customers/status/${id}`);
    return response.data;
}