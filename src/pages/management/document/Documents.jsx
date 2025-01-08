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
    Menu
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
// import { fetchDocumentsApi } from './service';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';
import { Link } from 'react-router-dom';

export default function Document() {
    const dispatch = useDispatch();
    const [firstRender, setFirstRender] = useState(true);
    const [documents, setDocuments] = useState([
        { name: 'Document 1', downloadUrl: '/downloads/document1.pdf' },
        { name: 'Document 2', downloadUrl: '/downloads/document2.pdf' },
        { name: 'Document 3', downloadUrl: '/downloads/document3.pdf' }
    ]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlefetchDocuments = async () => {
        const data = {
            pageNumber: page,
            searchValue
        };
        dispatch(setLoading());
        // const res = await fetchDocumentsApi(data);
        dispatch(clearLoading());
        // Simulate fetching documents with seeded data
        const res = {
            success: true,
            documents: [
                { name: 'Document 1', downloadUrl: '/downloads/document1.pdf' },
                { name: 'Document 2', downloadUrl: '/downloads/document2.pdf' },
                { name: 'Document 3', downloadUrl: '/downloads/document3.pdf' }
            ],
            totalPages: 1
        };

        console.log(res);
        if (res.success) {
            setDocuments(res.documents);
            setTotalPage(res.totalPages);
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message
            };
            dispatch(setPopup(dataPopup));
        }
    };

    useEffect(() => {
        handlefetchDocuments();
    }, [page]);

    useEffect(() => {
        if (!firstRender) {
            setPage(1);
            dispatch(setLoading());
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
                    <Grid item xs={12} sm={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button component={Link} to='/management/document/add-document'
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
                    </Grid>
                </Grid>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Document</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.length > 0 && documents.map((document, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>{document.name}</Typography>
                                    </TableCell>
                                    <TableCell align='right'>
                                        <IconButton component="a" href={document.downloadUrl} download>
                                            <DownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {documents.length === 0 && (
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell colSpan={2} sx={{ textAlign: 'center' }}>No data found</TableCell>
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
        </Box>
    );
}
