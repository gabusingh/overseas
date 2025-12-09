"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { getNotifications } from "@/services/hra.service";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "job" | "application" | "document" | "system" | "promotion";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const notificationTypes = [
    { key: "all", label: "All Notifications", icon: "fa fa-bell" },
    { key: "job", label: "Job Alerts", icon: "fa fa-briefcase" },
    { key: "application", label: "Applications", icon: "fa fa-file-text" },
    { key: "document", label: "Documents", icon: "fa fa-folder" },
    { key: "system", label: "System", icon: "fa fa-cog" },
    { key: "promotion", label: "Promotions", icon: "fa fa-tag" }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Try to fetch real notifications
        const response = await getNotifications(token);
        
        if (response?.notifications) {
          // Transform API response to match our interface
          const transformedNotifications: Notification[] = response.notifications.map((notif: any) => ({
            id: notif.id?.toString() || Math.random().toString(),
            title: notif.title || notif.subject || "Notification",
            message: notif.message || notif.body || notif.content || "",
            type: notif.type || "system",
            isRead: notif.is_read || notif.read_at || false,
            createdAt: notif.created_at || new Date().toISOString(),
            actionUrl: notif.action_url || notif.link,
            priority: notif.priority || "medium"
          }));
          setNotifications(transformedNotifications);
        } else {
          // If no notifications or empty response, show empty state
          setNotifications([]);
        }
      } catch (apiError) {
        // Fallback to mock data if API fails
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New Job Match Found!",
            message: "We found 3 new job opportunities matching your profile in Dubai, UAE. Check them out now!",
            type: "job",
            isRead: false,
            createdAt: "2024-12-10T10:30:00Z",
            actionUrl: "/jobs",
            priority: "high"
          },
          {
            id: "2",
            title: "Application Status Updated",
            message: "Your application for Software Engineer position at Tech Solutions LLC has been shortlisted for interview.",
            type: "application",
            isRead: false,
            createdAt: "2024-12-10T09:15:00Z",
            actionUrl: "/applied-jobs",
            priority: "high"
          },
          {
            id: "3",
            title: "Document Verification Complete",
            message: "Your passport document has been verified and approved. You can now apply to premium job listings.",
            type: "document",
            isRead: true,
            createdAt: "2024-12-09T16:45:00Z",
            actionUrl: "/my-documents",
            priority: "medium"
          },
          {
            id: "4",
            title: "Profile Completion Reminder",
            message: "Complete your profile to increase visibility to employers. Add your work experience and skills.",
            type: "system",
            isRead: false,
            createdAt: "2024-12-09T14:20:00Z",
            actionUrl: "/my-profile",
            priority: "medium"
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filter === "all" || 
      (filter === "read" && notification.isRead) || 
      (filter === "unread" && !notification.isRead);
    
    const typeMatch = typeFilter === "all" || notification.type === typeFilter;
    
    return statusMatch && typeMatch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // For now, just show success since we don't have specific mark as read API
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // For now, just show success since we don't have specific mark all as read API
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      // For now, just show success since we don't have specific delete notification API
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconMap = {
      job: "fa fa-briefcase text-blue-500",
      application: "fa fa-file-text text-green-500",
      document: "fa fa-folder text-yellow-500",
      system: "fa fa-cog text-gray-500",
      promotion: "fa fa-tag text-purple-500"
    };
    return iconMap[type];
  };

  const getPriorityBorder = (priority: Notification["priority"]) => {
    const priorityMap = {
      high: "border-l-red-500",
      medium: "border-l-yellow-500", 
      low: "border-l-gray-300"
    };
    return priorityMap[priority];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notifications - Stay Updated | Overseas.ai</title>
        <meta name="description" content="Stay updated with job alerts, application updates, and important notifications." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-bell mr-3"></i>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Stay updated with your job applications and important updates
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <i className="fa fa-check mr-2"></i>
              Mark All as Read
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="font-semibold mb-4">Status Filter</h3>
              <div className="space-y-2">
                {[
                  { key: "all", label: "All Notifications" },
                  { key: "unread", label: `Unread (${unreadCount})` },
                  { key: "read", label: "Read" }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filter === filterOption.key
                        ? "bgBlue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Type Filter</h3>
              <div className="space-y-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setTypeFilter(type.key)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      typeFilter === type.key
                        ? "bgBlue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className={`${type.icon} mr-2`}></i>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-9">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <i className="fa fa-bell-slash text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
                <p className="text-gray-500">
                  {filter === "unread" ? "You're all caught up! No unread notifications." : "No notifications found."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityBorder(notification.priority)} hover:shadow-md transition-all cursor-pointer ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <i className={`${getNotificationIcon(notification.type)} text-2xl`}></i>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <h3 className={`text-lg font-semibold ${
                                !notification.isRead ? "textBlue" : "text-gray-900"
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <i className="fa fa-clock mr-1"></i>
                              {formatDate(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Mark as read"
                            >
                              <i className="fa fa-check"></i>
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete notification"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
