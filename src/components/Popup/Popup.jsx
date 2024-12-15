import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useDispatch, useSelector } from 'react-redux'
import { clearPopup } from '~/libs/features/popup/popupSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function Popup() {

    const dispatch = useDispatch()
    const popup = useSelector(state => state.popup.value)

    const handleClose = () => {
        dispatch(clearPopup())
    }

    return (
        <React.Fragment>
            <Dialog sx={{ userSelect: 'none' }}
                open={popup.open}
                TransitionComponent={Transition}
                keepMounted
                disableScrollLock
                onClose={handleClose}
                aria-describedby="popup"
            >
                {popup.data.type === 'success' && (
                    <DialogTitle sx={{ color: 'primary.main' }}>
                        Success
                    </DialogTitle>
                )}
                {popup.data.type === 'error' && (
                    <DialogTitle sx={{ color: 'error.main' }}>
                        Error
                    </DialogTitle>
                )}
                <DialogContent sx={{
                    width: { xs: '100%', md: '450px' },
                    wordWrap: 'break-word'
                }}>
                    {popup.data.message}
                </DialogContent>
                <DialogActions>
                    {popup.data.type === 'success' && (
                        <Button sx={{ textTransform: 'capitalize' }}
                            variant='contained'
                            onClick={handleClose}>
                            Agree
                        </Button>
                    )}
                    {popup.data.type === 'error' && (
                        <Button sx={{ textTransform: 'capitalize' }}
                            variant='outlined'
                            color='error'
                            onClick={handleClose}>
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
