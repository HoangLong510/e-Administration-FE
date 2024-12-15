import React from 'react'
import { styled } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import { Link, useLocation } from 'react-router-dom'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import AdminListItem from './AdminListItem'
import menuItems from './menuItems'
import { useSelector } from 'react-redux'

const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden'
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    }
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    })
)

const MenuList = ({ pathname, open, role }) => {
    return (
        <>
            <List sx={{
                mt: '60px',
                p: 0,
                width: { xs: '240px', md: 'auto' }
            }}>
                {menuItems.map((items, index) => {
                    const Icon = items.icon
                    if (items.role.includes(role)) return (
                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton component={Link} to={items.href}
                                sx={[
                                    open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                    {
                                        minHeight: '60px',
                                        color: pathname === items.href ? 'primary.main' : '#555',
                                        bgcolor: pathname === items.href ? '#f3f3f3' : '#fff',
                                        borderLeft: '3px solid #fff',
                                        borderColor: pathname === items.href ? 'primary.main' : '#fff',
                                    }
                                ]}
                            >
                                <ListItemIcon
                                    sx={[{ minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                    ]}
                                >
                                    <Icon sx={{
                                        color: pathname === items.href ? 'primary.main' : '#555',
                                        fontSize: '25px'
                                    }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '15px' }}>
                                            {items.label}
                                        </Typography>
                                    }
                                    sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
            <Divider />
            <AdminListItem pathname={pathname} open={open} />
            <Divider />
        </>
    )
}

export default function Menu({ open }) {
    const user = useSelector(state => state.user.value)

    const location = useLocation()
    const pathname = location.pathname

    return (
        <>
            <Drawer variant="permanent" open={open} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuList pathname={pathname} open={open} role={user.data.role} />
            </Drawer>
            <MuiDrawer variant="persistent" open={open} sx={{ display: { xs: 'flex', md: 'none' } }}>
                <MenuList pathname={pathname} open={open} role={user.data.role} />
            </MuiDrawer>
        </>
    )
}
