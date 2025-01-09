import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch } from 'react-redux';
import { disableSoftwareApi } from './service';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { setPopup } from '~/libs/features/popup/popupSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
});

export default function DisableSoftware({ disableId, setDisableId }) {
    const dispatch = useDispatch();

    const handleClose = () => {
        setDisableId(null);
    };

    const handleDisableSoftware = async () => {
        dispatch(setLoading());
        const res = await disableSoftwareApi(disableId);

        setDisableId(null);
        dispatch(clearLoading());

        if (res.success) {
            const dataPopup = {
                type: 'success',
                message: res.message
            };
            dispatch(setPopup(dataPopup));
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
            <Dialog disableScrollLock
                open={!!disableId}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="popup-disable-software"
            >
                <DialogTitle color='primary'>Disable Software</DialogTitle>
                <DialogContent>
                    <DialogContentText id="popup-disable-software">
                        Are you sure you want to disable this software?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ textTransform: 'capitalize' }}>
                        Close
                    </Button>
                    <Button variant='contained' onClick={handleDisableSoftware} sx={{ textTransform: 'capitalize' }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
