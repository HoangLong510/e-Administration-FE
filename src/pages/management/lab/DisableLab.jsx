import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useDispatch } from 'react-redux'
import { disableLabApi } from './service'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { setPopup } from '~/libs/features/popup/popupSlice'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisableLab({ disableId, setDisableId, fetchLabs }) {
    const dispatch = useDispatch();

    const handleClose = () => {
        setDisableId(null);
    };

    const handleDisableLab = async () => {
        dispatch(setLoading());
        const res = await disableLabApi(disableId);

        setDisableId(null);
        dispatch(clearLoading());

        if (res.success) {
            const dataPopup = {
                type: 'success',
                message: res.message
            };
            dispatch(setPopup(dataPopup));
            fetchLabs();  // Gọi lại hàm fetchLabs để làm mới bảng
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message
            };
            dispatch(setPopup(dataPopup));
        }
    };

    return (
        <React.Fragment>
            <Dialog
                disableScrollLock
                open={!!disableId}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="popup-disable-lab"
            >
                <DialogTitle color='primary'>Disable Lab</DialogTitle>
                <DialogContent>
                    <DialogContentText id="popup-disable-lab">
                        Are you sure you want to disable this lab?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ textTransform: 'capitalize' }}>
                        Close
                    </Button>
                    <Button variant='contained' onClick={handleDisableLab} sx={{ textTransform: 'capitalize' }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
