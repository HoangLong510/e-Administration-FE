import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useDispatch, useSelector } from 'react-redux'
import { closeLogout } from '~/libs/features/logout/logoutSlice'
import { logoutApi } from './service'
import { clearUser } from '~/libs/features/user/userSlice'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function PopupLogout() {
    const dispatch = useDispatch()
    const open = useSelector(state => state.logout.value)
    const user = useSelector(state => state.user.value)
    const loading = useSelector(state => state.loading.value)

    const handleClose = () => {
        dispatch(closeLogout())
    }

    const handleLogout = async () => {
        dispatch(setLoading())
        const res = await logoutApi()

        setTimeout(() => {
            if (res.success) {
                dispatch(clearUser())
            }
            dispatch(closeLogout())
            dispatch(clearLoading())
        }, 1000)
    }

    return (
        <React.Fragment>
            <Dialog disableScrollLock sx={{ userSelect: 'none' }}
                open={open && user.exists}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-logout"
            >
                <DialogTitle color='primary'>{"Logout"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-logout">
                        Are you sure you want to logout of the website?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} onClick={handleClose} sx={{
                        textTransform: 'capitalize'
                    }}>
                        Close
                    </Button>
                    <Button disabled={loading} variant='contained' onClick={handleLogout} sx={{
                        textTransform: 'capitalize'
                    }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
