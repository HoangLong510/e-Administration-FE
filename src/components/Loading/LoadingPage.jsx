import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export default function LoadingPage() {
    return (
        <Box sx={{
            backgroundImage: "url('/images/background/background1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            padding: '40px 20px',
            overflow: "hidden"
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: '300px',
                borderRadius: '10px',
                padding: '30px 20px',
                bgcolor: '#fff',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <img src='/images/logo/logo.png'
                    height={'40'}
                    alt='logo'
                />
                <CircularProgress sx={{ mt: 6 }} />
                <Typography sx={{ mt: 6 }}>
                    Please wait a moment
                </Typography>
            </Box>
        </Box>
    )
}
