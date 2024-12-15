import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { useSelector } from 'react-redux'
import adminMenuItems from './adminMenuItems'

export default function AdminListItem({ pathname, open }) {
    const user = useSelector(state => state.user.value)

    const [openList, setOpenList] = React.useState(false)

    const handleClick = () => {
        setOpenList(!openList)
    }

    if (user.data.role === "Admin") return (
        <List sx={{
            p: 0,
            width: { xs: '240px', md: 'auto' }
        }}>
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton onClick={handleClick}
                    sx={[
                        open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        {
                            minHeight: '60px',
                            color: openList ? 'primary.main' : '#555',
                            borderLeft: '3px solid #fff'
                        }
                    ]}
                >
                    <ListItemIcon
                        sx={[{ minWidth: 0, justifyContent: 'center' },
                        open ? { mr: 3 } : { mr: 'auto' },
                        ]}
                    >
                        <SettingsRoundedIcon sx={{
                            color: openList ? 'primary.main' : '#555',
                            fontSize: '25px'
                        }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography sx={{ fontSize: '15px' }}>
                                Management
                            </Typography>
                        }
                        sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                    />
                    {openList ? (
                        <ExpandLess sx={[open ? { display: "flex" } : { display: "none" }]} />
                    ) : (
                        <ExpandMore sx={[open ? { display: "flex" } : { display: "none" }]} />
                    )}
                </ListItemButton>
            </ListItem>

            <Collapse in={openList} unmountOnExit>
                <List component="div" disablePadding>
                    {adminMenuItems.map((items, index) => {
                        const Icon = items.icon
                        return (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton LinkComponent={Link} to={items.href}
                                    sx={[
                                        open ? { justifyContent: 'initial', pl: 4 } : { justifyContent: 'center', pl: 2.5 },
                                        {
                                            minHeight: '60px',
                                            color: pathname === items.href ? 'primary.main' : '#555',
                                            borderLeft: '3px solid #fff',
                                            borderColor: pathname === items.href ? 'primary.main' : '#fff',
                                            bgcolor: pathname === items.href ? '#f3f3f3' : '#fff',
                                            fontSize: '14px'
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
                                            fontSize: '22px'
                                        }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontSize: '15px' }}>
                                                {items.label}
                                            </Typography>
                                        }
                                        sx={[
                                            open ? { opacity: 1 } : { opacity: 0 }
                                        ]}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Collapse>
        </List>
    )

    return (<></>)
}
