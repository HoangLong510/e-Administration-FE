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
    IconButton,
    Grid,
    InputAdornment,
    Pagination,
    Menu,
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchDocumentsApi, downloadDocumentApi } from './service';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import DisableDocument from './DisableDocument'; 

export default function Document() {

    const user = useSelector((state) => state.user.value);

    const dispatch = useDispatch();
    const [firstRender, setFirstRender] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [disableId, setDisableId] = useState(null);

    const handleMenuOpen = (event, document) => {
        setAnchorEl(event.currentTarget);
        setSelectedDocument(document);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedDocument(null);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDeleteRequest = (id) => {
        setDisableId(id);
        handleMenuClose();
    };

    const handleDownload = async (id) => {
        dispatch(setLoading());
        const res = await downloadDocumentApi(id);
        dispatch(clearLoading());

        if (res.success) {
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', res.fileName); 
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            dispatch(setPopup({
                type: 'error',
                message: res.message
            }));
        }
    };

    const handlefetchDocuments = async () => {
        dispatch(setLoading());
        const res = await fetchDocumentsApi({ searchValue, page, status: true });
        dispatch(clearLoading());

        if (res.success) {
            setDocuments(res.documents || []);
            setTotalPage(res.totalPages);
        } else {
            dispatch(setPopup({
                type: 'error',
                message: res.message
            }));
        }
    };

    useEffect(() => {
        handlefetchDocuments();
    }, [page]);

    useEffect(() => {
        if (!firstRender) {
            setPage(1);
            const handleSearchDocuments = setTimeout(async () => {
                handlefetchDocuments();
            }, 500);
            return () => {
                clearTimeout(handleSearchDocuments);
            };
        } else {
            setFirstRender(false);
        }
    }, [searchValue]);

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
            justifyContent: 'space-between'
        }}>
            <Box sx={{ width: '100%' }}>
                <Typography sx={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#000'
                }}>
                    List of Documents
                </Typography>
                <Typography sx={{
                    mb: '40px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    Document management
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={12} md={5}>
                        <TextField fullWidth size='small'
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    {(user.data.role === "Admin" || user.data.role === "Instructor") && (
                    <Grid item xs={12} sm={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button component={Link} to='/document/add-document'
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
                            New Document
                        </Button>
                    </Grid>)}
                </Grid>
                
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Document</TableCell>
                                <TableCell>Upload Date</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.length > 0 && documents.map((document, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>{document.name}</Typography>
                                    </TableCell>
                                    <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                                    <TableCell align='right'>
                                        <IconButton onClick={(e) => handleMenuOpen(e, document)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => handleDownload(selectedDocument?.id)}>
                                                <DownloadIcon sx={{ mr: 1 }} /> Download
                                            </MenuItem>
                                            {(user.data.role === "Admin")&&(
                                            <MenuItem onClick={() => handleDeleteRequest(selectedDocument?.id)}>
                                                <DeleteIcon sx={{ mr: 1 }} /> Delete
                                            </MenuItem>
                                        )}
                                        </Menu>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {documents.length === 0 && (
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No data found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={totalPage}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
            <DisableDocument disableId={disableId} setDisableId={setDisableId} onDisableSuccess={handlefetchDocuments} />
        </Box>
    );
}
