import { axiosInstance } from "../../api/axios";

export const getAllBrand = async () => {
    const response = await axiosInstance.get("/brands/getBrands");
    return response.data;
}