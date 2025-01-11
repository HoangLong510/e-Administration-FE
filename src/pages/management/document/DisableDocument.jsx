import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch } from 'react-redux';
import { disableDocumentApi } from './service';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { setPopup } from '~/libs/features/popup/popupSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisableDocument({ disableId, setDisableId, onDisableSuccess }) {
    const dispatch = useDispatch();

    const handleClose = () => {
        setDisableId(null);
    };

    const handleDisableDocument = async () => {
        dispatch(setLoading());
        const res = await disableDocumentApi(disableId);

        setDisableId(null);
        dispatch(clearLoading());

        if (res.success) {
            dispatch(setPopup({
                type: 'success',
                message: res.message
            }));
            onDisableSuccess(); // Gọi hàm onDisableSuccess sau khi xóa thành công
        } else {
            dispatch(setPopup({
                type: 'error',
                message: res.message
            }));
        }
    };

    return (
        <React.Fragment>
            <Dialog disableScrollLock
                open={!!disableId}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="popup-disable-document"
            >
                <DialogTitle color='primary'>Disable Document</DialogTitle>
                <DialogContent>
                    <DialogContentText id="popup-disable-document">
                        Are you sure you want to disable this document?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ textTransform: 'capitalize' }}>
                        Close
                    </Button>
                    <Button variant='contained' onClick={handleDisableDocument} sx={{ textTransform: 'capitalize' }}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
