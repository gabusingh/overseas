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
    console.error('Error fetching notifications:', error);
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
    console.error('Error marking notification as read:', error);
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
    console.error('Error marking all notifications as read:', error);
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
    console.error('Error deleting notification:', error);
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
    console.error('Error fetching notification settings:', error);
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
    console.error('Error updating notification settings:', error);
    throw error;
  }
};
