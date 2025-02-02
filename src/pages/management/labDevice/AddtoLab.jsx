import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Checkbox,
    Grid,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { Link, useParams } from 'react-router-dom';
import { fetchAddToLabApi, addDevicesToLabApi } from './service';

export default function AddToLab({ labName }) {
    const dispatch = useDispatch();
    const { labId } = useParams();
    const [devices, setDevices] = useState([]);
    const [selectedDeviceIds, setSelectedDeviceIds] = useState(new Set()); 
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event) => { 
        setSearchValue(event.target.value); 
    };

    const handleToggleAll = (event) => {
        const newSelectedDeviceIds = new Set(selectedDeviceIds);
        if (event.target.checked) {
            devices.forEach((device) => {
                const prefix = device.isSoftware ? 'software-' : 'device-';
                newSelectedDeviceIds.add(prefix + device.id);
            });
        } else {
            devices.forEach((device) => {
                const prefix = device.isSoftware ? 'software-' : 'device-';
                newSelectedDeviceIds.delete(prefix + device.id);
            });
        }
        setSelectedDeviceIds(newSelectedDeviceIds);
    };

    const handleToggle = (device) => {
        const newSelectedDeviceIds = new Set(selectedDeviceIds);
        const prefix = device.isSoftware ? 'software-' : 'device-';
        const idWithPrefix = prefix + device.id;

        if (newSelectedDeviceIds.has(idWithPrefix)) {
            newSelectedDeviceIds.delete(idWithPrefix);
        } else {
            newSelectedDeviceIds.add(idWithPrefix);
        }
        setSelectedDeviceIds(newSelectedDeviceIds);
    };

    const handlefetchLabDevices = async () => {
        const data = {
            searchValue,
        };
        dispatch(setLoading());
        const res = await fetchAddToLabApi(data); // Gọi API lấy dữ liệu
        dispatch(clearLoading());

        if (res.success) {
            setDevices(res.devices);
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message,
            };
            dispatch(setPopup(dataPopup));
        }
    };

    const handleAddDevicesToLab = async () => {
        const deviceIds = Array.from(selectedDeviceIds).map(id => id.replace('software-', '').replace('device-', ''));
        const data = {
            labId,
            deviceIds,
        };
        dispatch(setLoading());
        const res = await addDevicesToLabApi(data); // Gọi API để thêm các thiết bị vào lab
        dispatch(clearLoading());

        if (res.success) {
            const dataPopup = {
                type: 'success',
                message: "Devices added to lab successfully",
            };
            dispatch(setPopup(dataPopup));
            setSelectedDeviceIds(new Set());
            handlefetchLabDevices(); // Fetch the updated list
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message,
            };
            dispatch(setPopup(dataPopup));
        }
    };

    useEffect(() => {
        handlefetchLabDevices();
    }, [searchValue]);

    useEffect(() => {
        handlefetchLabDevices();
    }, []);

    return (
        <Box sx={{
            width: '100%',
            bgcolor: '#fff',
            padding: '40px 30px',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            minHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            <Box sx={{ width: '100%' }}>
                <Typography sx={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#000',
                }}>
                    Add Devices to Lab: {labName}
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
                    <Grid item xs={12} sm={6} md={5}>
                        <TextField
                            fullWidth
                            size='small'
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            value={searchValue}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={7} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: '20px',
                                textTransform: 'none',
                                height: '100%',
                                padding: '10px 20px',
                            }}
                            onClick={handleAddDevicesToLab} // Gọi hàm khi bấm nút Add
                        >
                            {`Add ${selectedDeviceIds.size > 0 ? `(${selectedDeviceIds.size})` : ''}`}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                borderRadius: '20px',
                                textTransform: 'none',
                                height: '100%',
                                padding: '10px 20px',
                            }}
                            component={Link}
                            to={`/management/labdevice/${labId}`} // Sử dụng Link để điều hướng và thêm LabId vào URL
                        >
                            Back to Lab Device
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selectedDeviceIds.size > 0 && selectedDeviceIds.size < devices.length}
                                        checked={devices.length > 0 && selectedDeviceIds.size === devices.length}
                                        onChange={handleToggleAll}
                                    />
                                </TableCell>
                                <TableCell>Device</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {devices.length > 0 && devices.map((device, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedDeviceIds.has((device.isSoftware ? 'software-' : 'device-') + device.id)}
                                            onChange={() => handleToggle(device)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>{device.name}</Typography>
                                            <Typography sx={{ fontSize: '15px', color: '#666' }}>{device.type}</Typography>
                                            {device.isSoftware && device.licenseExpire && (
                                                <Typography sx={{ fontSize: '13px', color: '#666' }}>License Expire: {device.licenseExpire}</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{device.description}</TableCell>
                                </TableRow>
                            ))}
                            {devices.length === 0 && (
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No data found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
