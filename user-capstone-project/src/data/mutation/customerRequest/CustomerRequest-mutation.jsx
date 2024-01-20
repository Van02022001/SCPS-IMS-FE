import { axiosInstance } from "../../api/axios";

export const getAllCustomerRequest = async () => {
    const response = await axiosInstance.get(`/customer-request-receipts/all`);
    return response.data;
}

export const createRequestCustomer = async (recieptParams) => {
    const response = await axiosInstance.post(`/customer-request-receipts`, recieptParams);
    return response.data;
}
export const editExportRequestReceipt = async (customerRequestReceiptId, editExportReceiptParams) => {
    const response = await axiosInstance.put(`/customer-request-receipts/${customerRequestReceiptId}/start-export`, editExportReceiptParams);
    return response.data;
}

export const getAllCustomerRequestOfWarehouse = async () => {
    const response = await axiosInstance.get(`/customer-request-receipts/warehouse`);
    return response.data;
}

export const getCustomerRequestById = async (id) => {
    const response = await axiosInstance.get(`/customer-request-receipts/${id}`);
    return response.data;
}
