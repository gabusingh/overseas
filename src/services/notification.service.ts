import axios from 'axios';

const BASE_URL = 'https://backend.overseas.ai/api/';

export const getNotifications = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'user-all-notification', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + `mark-notification-read/${notificationId}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async (accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'mark-all-notifications-read', {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId: number, accessToken: string) => {
  try {
    const response = await axios.delete(BASE_URL + `delete-notification/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotificationSettings = async (accessToken: string) => {
  try {
    const response = await axios.get(BASE_URL + 'get-notification-settings', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotificationSettings = async (settings: any, accessToken: string) => {
  try {
    const response = await axios.post(BASE_URL + 'update-notification-settings', settings, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
