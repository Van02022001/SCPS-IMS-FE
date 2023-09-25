import { axiosInstance } from "../../api/axios";

export const getAllCategory = async () => {
    const response = await axiosInstance.get("/categories/getAllCategory");
    return response.data;
}