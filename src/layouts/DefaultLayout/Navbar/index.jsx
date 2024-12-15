import { Box, IconButton, LinearProgress } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { Link } from 'react-router-dom'
import NavbarUser from './NavbarUser'
import { useSelector } from 'react-redux'

export default function Navbar({ openMenu, setOpenMenu }) {

    const loading = useSelector(state => state.loading.value)

    const handleSetOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            width: '100%',
            height: '60px',
            bgcolor: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: '1px solid #e6e6e6',
            display: 'flex',
            alignItems: 'center',
        }}>
            {/* Loading */}
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    width: '100%'
                }}>
                    <LinearProgress />
                </Box>
            )}

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '0px 20px'
            }}>
                {/* Left */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <IconButton onClick={() => handleSetOpenMenu()}>
                        {openMenu ? (
                            <MenuOpenIcon sx={{ color: '#555' }} />
                        ) : (
                            < MenuIcon sx={{ color: '#555' }} />
                        )}
                    </IconButton>
                    <Link to={'/'} style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <img src='/images/logo/logo.png'
                            height={'40'}
                            alt='logo'
                        />
                    </Link>
                </Box>

                {/* Right */}
                <NavbarUser />
            </Box>
        </Box>
    )
}
