import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LockIcon from '@mui/icons-material/Lock'
import Logout from '@mui/icons-material/Logout'
import { openLogout } from '~/libs/features/logout/logoutSlice'

export default function NavbarUser() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.value)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <Tooltip title={user.data.fullName}>
                <IconButton
                    size='small'
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: '30px', height: '30px' }} src={user.data.avatar} />
                </IconButton>
            </Tooltip>
            <Menu
                disableScrollLock
                anchorEl={anchorEl}
                id="account-menu"
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
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
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
                <MenuItem component={Link} to='/profile' onClick={handleClose} sx={{ height: '45px' }}>
                    <Avatar sx={{ width: '25px', height: '25px' }} src={user.data.avatar} />
                    <Typography sx={{ ml: 1, minWidth: '150px' }}>
                        {user.data.fullName}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to='/' sx={{ height: '45px' }}>
                    <ListItemIcon>
                        <LockIcon sx={{ fontSize: '25px' }} />
                    </ListItemIcon>
                    <Typography sx={{ ml: 1, fontSize: '15px' }}>
                        Change password
                    </Typography>
                </MenuItem>
                <MenuItem sx={{ height: '45px' }} onClick={() => {
                    dispatch(openLogout())
                    handleClose()
                }} >
                    <ListItemIcon>
                        <Logout sx={{ fontSize: '25px' }} />
                    </ListItemIcon>
                    <Typography sx={{ ml: 1, fontSize: '15px' }}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}
