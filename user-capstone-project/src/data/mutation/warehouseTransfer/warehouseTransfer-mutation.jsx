import { axiosInstance } from "../../api/axios";

export const getAllWarehouseTransfer = async () => {
    const response = await axiosInstance.get("/warehouse-transfer/transfers");
    return response.data;
}

export const createTransfer = async (transferParams) => {
    const response = await axiosInstance.post("/warehouse-transfer/transfer", transferParams);
    return response.data;
}