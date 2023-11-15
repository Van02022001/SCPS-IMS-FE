import { axiosInstance } from "../../api/axios";

export const getAllBrands = async () => {
    const response = await axiosInstance.get("/brands");
    return response.data;
}

export const createBrands = async (originParams) => {
    const response = await axiosInstance.post("/brands", originParams);
    return response.data;
}

export const deleteBrands = async (id) => {
    const response = await axiosInstance.delete(`/brands/${id}`,);
    return response.data;
}

export const editBrands = async (brandsId, editBrandsParams) => {
    const response = await axiosInstance.put(`/brands/${brandsId}`, editBrandsParams);
    return response.data;
}

export const getBrandSearch = async (keyWordBrand) => {
    const response = await axiosInstance.get(`/brands/search?keyword=${keyWordBrand}`);
    return response.data;
}
