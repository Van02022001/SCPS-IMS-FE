import { axiosInstance } from "../../api/axios";

export const authenLogin = async (loginParams) => {
    const response = await axiosInstance.post("/auth/authentication", loginParams);
    return response;
}

export const authenValidation = async () => {
    const response = await axiosInstance.post("/auth/validation");
    return response.data;
}

