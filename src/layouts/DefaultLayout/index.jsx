import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Menu from "./Menu"
import LoadingPage from "~/components/Loading/LoadingPage"

function DefaultLayout({ children }) {
    const [openMenu, setOpenMenu] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    if (!loading) {
        return (
            <Box sx={{ width: '100%', bgcolor: '#f3f3f3' }}>
                {/* Nav */}
                <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />

                <Box sx={{ display: 'flex' }}>
                    {/* Menu */}
                    <Menu open={openMenu} />

                    {/* Content */}
                    <Box component="main" sx={{
                        width: '100%',
                        flexGrow: 1,
                        mt: '60px',
                        padding: '20px',
                        bgcolor: '#f3f3f3',
                        minHeight: 'calc(100vh - 60px)',
                        userSelect: 'none'
                    }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        )
    }
    return (
        <LoadingPage />
    )
}

export default DefaultLayout