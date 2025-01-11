import axios from "~/axios";


const handleApiError = (error) => {
  if (error.response) {
    return error.response.data;
  }
  return {
    success: false,
    message: "Server is having problems, please try again later",
  };
};

export const getAllNotifications = async () => {
    try {
      const res = await axios.get('/notification/notifications', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.data && res.data.success) {
        return {
          success: true,
          unreadCount: res.data.unreadCount,
          data: res.data.data, // Dữ liệu thông báo trả về
        };
      } else {
        return {
          success: false,
          message: 'Failed to fetch notifications.',
        };
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        message: 'An error occurred while fetching notifications.',
      };
    }
  };

  export const markNotificationAsRead = async (notificationId) => {
    try {
      const res = await axios.put(`/notification/${notificationId}/mark-as-read`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        return error.response.data; // Trả về thông tin lỗi từ server
      }
      return {
        success: false,
        message: 'Server is having problems, please try again later',
      };
    }
  };
  



  