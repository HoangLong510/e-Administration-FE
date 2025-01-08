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
// import { fetchLabDevicesApi } from './service';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { Link } from 'react-router-dom';

export default function AddToLab({ labName }) {
    const dispatch = useDispatch();
    const [devices, setDevices] = useState([
        {
            name: 'Device 1',
            description: 'This is device 1',
            type: 'Hardware',
        },
        {
            name: 'Device 2',
            description: 'This is device 2',
            type: 'Software',
            licenseExpire: '2023-12-31',
        },
        {
            name: 'Device 3',
            description: 'This is device 3',
            type: 'Hardware',
        },
    ]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const handleToggleAll = (event) => {
        if (event.target.checked) {
            setSelectedDevices(devices.map((device) => device.name));
        } else {
            setSelectedDevices([]);
        }
    };

    const handleToggle = (name) => {
        const currentIndex = selectedDevices.indexOf(name);
        const newSelected = [...selectedDevices];

        if (currentIndex === -1) {
            newSelected.push(name);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedDevices(newSelected);
    };

    const handlefetchLabDevices = async () => {
        const data = {
            searchValue,
        };
        dispatch(setLoading());
        // const res = await fetchLabDevicesApi(data);
        dispatch(clearLoading());
        // Simulate fetching lab devices with seeded data
        const res = {
            success: true,
            devices: [
                {
                    name: 'Device 1',
                    description: 'This is device 1',
                    type: 'Hardware',
                },
                {
                    name: 'Device 2',
                    description: 'This is device 2',
                    type: 'Software',
                    licenseExpire: '2023-12-31',
                },
                {
                    name: 'Device 3',
                    description: 'This is device 3',
                    type: 'Hardware',
                },
            ],
        };

        console.log(res);
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
                            onChange={(e) => setSearchValue(e.target.value)}
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
                        >
                            {`Add ${selectedDevices.length > 0 ? `(${selectedDevices.length})` : ''}`}
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
                                        indeterminate={selectedDevices.length > 0 && selectedDevices.length < devices.length}
                                        checked={devices.length > 0 && selectedDevices.length === devices.length}
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
                                            checked={selectedDevices.indexOf(device.name) !== -1}
                                            onChange={() => handleToggle(device.name)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>{device.name}</Typography>
                                            <Typography sx={{ fontSize: '15px', color: '#666' }}>{device.type}</Typography>
                                            {device.type === 'Software' && (
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
