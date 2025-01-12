import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getAllNotifications, markNotificationAsRead } from "./service"; // Đảm bảo đường dẫn chính xác
import { useNavigate } from "react-router-dom";

export default function NavbarNotification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const Navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Fetch notifications when the component is mounted
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const data = await getAllNotifications(); // Gọi API
    if (data.success) {
      setNotifications(data.data); // Lưu thông báo vào state
      const unreadNotification = data.data.filter(
        (notification) => !notification.viewed
      );
      setUnreadCount(unreadNotification.length); // Lưu số lượng thông báo chưa đọc
    } else {
      console.error(data.message); // Nếu thất bại, hiển thị thông báo lỗi
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (reportId, notificationId) => {
    await handleMarkAsRead(notificationId);
    if (reportId) {
      Navigate(`/report-details/${reportId}`);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    // Tìm thông báo trong state
    const notification = notifications.find((n) => n.id === notificationId);

    // Nếu thông báo đã được đánh dấu là đã xem rồi thì không làm gì
    if (notification && notification.viewed) {
      return;
    }

    try {
      // Gọi API để đánh dấu thông báo là đã xem
      const result = await markNotificationAsRead(notificationId);

      if (result.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, viewed: true }
              : notification
          )
        );

        setUnreadCount((prevUnreadCount) => Math.max(0, prevUnreadCount - 1));
      } else {
        console.error("Error marking notification as read");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);
    return date.toLocaleString(); // Định dạng ngày giờ theo ngôn ngữ mặc định của hệ thống
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Notifications">
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge badgeContent={unreadCount} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock
        anchorEl={anchorEl}
        id="notification-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              borderRadius: "10px",
              overflow: "visible",
              filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))",
              mt: 2,
              width: "350px", // Tăng chiều rộng menu cho dễ nhìn
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <Typography sx={{ fontWeight: "bold" }}>Notifications</Typography>
        </MenuItem>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              sx={{
                height: "auto",
                whiteSpace: "normal",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                backgroundColor: notification.viewed
                  ? "transparent"
                  : "#f5f5f5",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "5px", // Cách nhau giữa các thông báo
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Màu khi hover
                },
              }}
              onClick={() =>
                handleNotificationClick(notification.reportId, notification.id)
              }
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: notification.viewed ? "normal" : "bold",
                  color: notification.viewed ? "text.primary" : "primary.main",

                  width: "100%",
                  wordWrap: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {notification.senderName} - {notification.content}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", color: "text.secondary" }}
              >
                {formatDate(notification.createdAt)}
              </Typography>
              {notification.ReportDetails && (
                <Box
                  sx={{
                    marginTop: "8px",
                    padding: "8px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Report Details:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", marginTop: "4px" }}
                  >
                    {notification.ReportDetails?.content}{" "}
                    {/* Ví dụ: Hiển thị nội dung báo cáo */}
                  </Typography>
                </Box>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography>No notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
