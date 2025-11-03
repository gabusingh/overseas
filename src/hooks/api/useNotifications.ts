import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api/client';
import { endpoints } from '../../lib/api/endpoints';
import { 
  Notification,
  ApiResponse,
  queryKeys 
} from '../../lib/api/types';
import { toast } from 'sonner';

// Get all notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: [...queryKeys.notifications, 'all'],
    queryFn: async (): Promise<Notification[]> => {
      const response = await api.get<ApiResponse<{ notifications: Notification[] }>>(
        endpoints.info.userAllNotifications
      );
      return response.data.data.notifications;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  return useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await api.post(
        `${endpoints.info.userAllNotifications}/${notificationId}/read`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Notification marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `${endpoints.info.userAllNotifications}/mark-all-read`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark all notifications as read');
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await api.delete(
        `${endpoints.info.userAllNotifications}/${notificationId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Notification deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete notification');
    },
  });
};

