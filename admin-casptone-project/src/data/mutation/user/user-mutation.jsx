import { axiosInstance } from "../../api/axios";

export const getAllUser = async () => {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
}

export const createUser = async (usersParams) => {
    const response = await axiosInstance.post("/admin/accounts", usersParams);
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response;
}
