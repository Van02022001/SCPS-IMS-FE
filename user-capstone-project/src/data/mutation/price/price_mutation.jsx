import { axiosInstance } from "../../api/axios";

export const getAllPriceAudit = async () => {
    const response = await axiosInstance.get(`/purchase-price-audits`);
    return response.data;
}

export const getAllSubCategory = async (auditId) => {
    const response = await axiosInstance.get(`/purchase-price-audits/${auditId}`);
    return response.data;
}

