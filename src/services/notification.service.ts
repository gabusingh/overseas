/**
 * @deprecated This service file is deprecated. Use React Query hooks from @/hooks/api/ instead.
 * 
 * Migration guide:
 * - Replace getNotifications() with useNotifications() from @/hooks/api/useNotifications
 * - Replace markNotificationRead() with useMarkNotificationRead() from @/hooks/api/useNotifications
 * - Replace deleteNotification() with useDeleteNotification() from @/hooks/api/useNotifications
 * 
 * Example migration:
 * Before: const data = await getNotifications(token);
 * After:  const { data } = useNotifications();
 */

import { 
  makeGetRequest, 
  makeFormDataRequest, 
  makeJsonRequest,
  makeDeleteRequest,
  endpoints 
} from '../lib/api/helpers';

// Consolidated notification function - standardize to return data
export const getNotifications = async (accessToken: string) => {
  try {
    return await makeGetRequest(endpoints.user.getAllNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number, accessToken: string) => {
  try {
    return await makeJsonRequest(`${endpoints.notification.markAsRead}/${notificationId}`, {});
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (accessToken: string) => {
  try {
    return await makeJsonRequest('mark-all-notifications-read', {});
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: number, accessToken: string) => {
  try {
    return await makeDeleteRequest(`${endpoints.notification.deleteNotification}/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const getNotificationSettings = async (accessToken: string) => {
  try {
    return await makeGetRequest('get-notification-settings');
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
};

export const updateNotificationSettings = async (settings: any, accessToken: string) => {
  try {
    return await makeJsonRequest('update-notification-settings', settings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};
