import { axiosInstance } from "../../api/axios";

export const getAllNotification = async (userId) => {
    const response = await axiosInstance.get(`/notifications/user-notifications/${userId}`);
    return response.data;
}

export const getAllNotificationDetail = async (notificationId) => {
    const response = await axiosInstance.get(`/notifications/users/${notificationId}`);
    return response.data;
}
