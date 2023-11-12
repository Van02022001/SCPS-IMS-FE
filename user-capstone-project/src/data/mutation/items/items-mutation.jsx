import { axiosInstance } from "../../api/axios";

export const getAllItems = async () => {
    const response = await axiosInstance.get("/items");
    return response.data;
}

