import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NavbarNotification() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const notifications = [
        { sender: 'Huy', content: 'AN TOÀN BỨT PHÁ, VỮNG CHÃI MỌI CUNG ĐƯỜNG Chuẩn bị cho những chuyến đi dài ngày hay hành trình cuối năm chưa bao giờ yên tâm đến vậy với Toyota Safety Sense ', time: '2 minutes ago' },
        { sender: 'Long', content: 'updated the report.', time: '1 hour ago' },
        { sender: 'Quan', content: 'commented on your report.', time: '3 hours ago' },
        { sender: 'Linh', content: 'approved your report.', time: '1 day ago' },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
                <IconButton
                    size="small"
                    onClick={handleClick}
                    aria-controls={open ? 'notification-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <NotificationsIcon />
                </IconButton>
            </Tooltip>
            <Menu
                disableScrollLock
                anchorEl={anchorEl}
                id="notification-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            borderRadius: '10px',
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))',
                            mt: 2,
                            width: '300px', // Set fixed width
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disabled>
                    <Typography sx={{ fontWeight: 'bold' }}>Notification</Typography>
                </MenuItem>
                {notifications.map((notification, index) => (
                    <MenuItem key={index} sx={{ height: 'auto', whiteSpace: 'normal', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{notification.sender}</Typography>
                        <Typography variant="body2" sx={{ width: '100%', wordWrap: 'break-word', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notification.content}</Typography>
                        <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
