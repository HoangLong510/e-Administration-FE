import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useDispatch } from 'react-redux'
import { disableDeviceApi } from './service'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { setPopup } from '~/libs/features/popup/popupSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function DisableDevice({ disableId, setDisableId }) {
    const dispatch = useDispatch()

    const handleClose = () => {
        setDisableId(null)
    }

    const handleDisableDevice = async () => {
        dispatch(setLoading())
        const res = await disableDeviceApi(disableId)

        setDisableId(null)
        dispatch(clearLoading())

        if (res.success) {
            const dataPopup = {
                type: 'success',
                message: res.message
            }
            dispatch(setPopup(dataPopup))
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message
            }
            dispatch(setPopup(dataPopup))
        }
    }

    return (
        <React.Fragment>
            <Dialog disableScrollLock
                open={!!disableId}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="popup-disable-device"
            >
                <DialogTitle color='primary'>Disable Device</DialogTitle>
                <DialogContent>
                    <DialogContentText id="popup-disable-device">
                        Are you sure you want to disable this device?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ textTransform: 'capitalize' }}>
                        Close
                    </Button>
                    <Button variant='contained' onClick={handleDisableDevice} sx={{ textTransform: 'capitalize' }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
