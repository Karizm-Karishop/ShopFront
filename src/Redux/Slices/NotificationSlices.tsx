/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';


export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

export enum NotificationType {
  CONTACT = 'CONTACT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PRODUCT = 'PRODUCT',
  SYSTEM = 'SYSTEM'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  details?: Record<string, any>;
  createdAt: Date;
  isDeleted: boolean;
  user?: {
    user_id: number;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadNotifications: Notification[];
  readNotifications: Notification[];
  contactNotifications: Notification[];
  subscriptionNotifications: Notification[];
  productNotifications: Notification[];
  systemAlertNotifications: Notification[];
  
  notificationSummary: {
    totalCount: number;
    unreadCount: number;
    highPriorityCount: number;
    last24HoursCount: number;
  };
  
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadNotifications: [],
  readNotifications: [],
  contactNotifications: [],
  subscriptionNotifications: [],
  productNotifications: [],
  systemAlertNotifications: [],
  
  notificationSummary: {
    totalCount: 0,
    unreadCount: 0,
    highPriorityCount: 0,
    last24HoursCount: 0
  },
  
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/notifications`;


export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (
    notificationData: {
      type: NotificationType;
      message: string;
      status?: NotificationStatus;
      priority?: NotificationPriority;
      details?: Record<string, any>;
      userId?: number;
      recipientEmail?: string;
      recipientName?: string;
      phoneNumber?: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(apiUrl, notificationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      showSuccessToast('Notification created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create notification';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (
    params: {
      page?: number;
      limit?: number;
      type?: NotificationType;
      status?: NotificationStatus;
      priority?: NotificationPriority;
      search?: string;
      startDate?: string;
      endDate?: string;
      userId?: number;
    } = {},
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateNotificationStatus = createAsyncThunk(
  'notifications/updateStatus',
  async (
    updateData: {
      notificationIds: number[];
      status: NotificationStatus;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.put(`${apiUrl}/status`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      showSuccessToast('Notification status updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update notification status';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const deleteNotification = createAsyncThunk(
  'album/deleteNotification',
  async (NotificationId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
       await axios.delete(`${apiUrl}/${NotificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Notification deleted successfully');
      
      return NotificationId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Notification';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNotificationSummary = createAsyncThunk(
  'notifications/fetchSummary',
  async (  rejectWithValue: any ) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notification summary';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnread',
  async ( rejectWithValue:any ) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/unread`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch unread notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchReadNotifications = createAsyncThunk(
  'notifications/fetchRead',
  async ( rejectWithValue :any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/read`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch read notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchContactUsNotifications = createAsyncThunk(
  'notifications/fetchContactUs',
  async (rejectWithValue :any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
 
    try {
      const response = await axios.get(`${apiUrl}/contact-us`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
   
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Contact Us notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSubscriptionNotifications = createAsyncThunk(
  'notifications/fetchSubscriptions',
  async ( rejectWithValue :any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Subscription notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProductUpdateNotifications = createAsyncThunk(
  'notifications/fetchProductUpdates',
  async ( rejectWithValue :any ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/product-updates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Product Update notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSystemAlertNotifications = createAsyncThunk(
  'notifications/fetchSystemAlerts',
  async (  rejectWithValue :any ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    try {
      const response = await axios.get(`${apiUrl}/system-alerts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch System Alert notifications';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: () => initialState,
    setPagination: (state, action: PayloadAction<{
      page?: number;
      limit?: number;
    }>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload.data);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateNotificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIds = action.meta.arg.notificationIds;
        state.notifications = state.notifications.map(notification => 
          updatedIds.includes(notification.id) 
            ? {...notification, status: action.meta.arg.status} 
            : notification
        );
      })
      .addCase(updateNotificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.payload.notificationIds;
        state.notifications = state.notifications.filter(
          (notification) => !deletedIds.includes(notification.id)
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchNotificationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationSummary = action.payload.data;
      })
      .addCase(fetchNotificationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadNotifications = action.payload.data;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchReadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.readNotifications = action.payload.data;
      })
      .addCase(fetchReadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchContactUsNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactUsNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.contactNotifications = action.payload.data;
      })
      .addCase(fetchContactUsNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSubscriptionNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionNotifications = action.payload.data;
      })
      .addCase(fetchSubscriptionNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductUpdateNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductUpdateNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.productNotifications = action.payload.data;
      })
      .addCase(fetchProductUpdateNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSystemAlertNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemAlertNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.systemAlertNotifications = action.payload.data;
      })
      .addCase(fetchSystemAlertNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetNotificationState, setPagination } = notificationSlice.actions;

export default notificationSlice.reducer;