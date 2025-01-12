import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/Info'
import { Link } from 'react-router-dom'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { getTasksApi } from './service'
import { setPopup } from '~/libs/features/popup/popupSlice'

const statusColors = {
    'Canceled': 'error',
    'Pending': 'warning',
    'InProgress': 'info',
    'Completed': 'primary'
}

const statusLabel = {
    'Canceled': 'Canceled',
    'Pending': 'Pending',
    'InProgress': 'In Progress',
    'Completed': 'Completed'
}

export default function Task() {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.loading.value)
    const user = useSelector(state => state.user.value)

    const [firstRender, setFirstRender] = useState(true)

    const [tasks, setTasks] = useState([])

    const [status, setStatus] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const handleStatusFilterChange = (event) => {
        setStatus(event.target.value)
    }

    const handlePageChange = (event, value) => {
        setPage(value)
    }

    const handleGetTasks = async () => {
        const data = {
            status,
            pageNumber: page,
            searchValue
        }

        dispatch(setLoading())
        const res = await getTasksApi(data)
        dispatch(clearLoading())

        if (res.success) {
            setTasks(res.tasks)
            setTotalPage(res.totalPages)
        } else {
            const dataPopup = {
                type: 'error',
                message: res.message
            }
            dispatch(setPopup(dataPopup))
        }
    }

    useEffect(() => {
        handleGetTasks()
    }, [status, page])

    useEffect(() => {
        if (!firstRender) {
            setPage(1)
            dispatch(setLoading())
            const handleSearchTasks = setTimeout(async () => {
                handleGetTasks()
            }, 500)
            return () => {
                clearTimeout(handleSearchTasks)
            }
        } else {
            setFirstRender(false)
        }
    }, [searchValue])

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
                    List of tasks
                </Typography>
                <Typography sx={{
                    mb: '40px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    Your task
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4} md={3}>
                        <FormControl fullWidth size='small'>
                            <InputLabel id="select-status">Status</InputLabel>
                            <Select
                                labelId="select-status"
                                label="Status"
                                value={status}
                                onChange={handleStatusFilterChange}
                            >
                                <MenuItem value={''}>-- Get all tasks --</MenuItem>
                                <MenuItem value={'Pending'}>Pending</MenuItem>
                                <MenuItem value={'InProgress'}>In Progress</MenuItem>
                                <MenuItem value={'Completed'}>Completed</MenuItem>
                                <MenuItem value={'Canceled'}>Canceled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                        <TextField fullWidth size='small'
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            {loading && (
                                                <CircularProgress size="20px" />
                                            )}
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Grid>
                    {user.data.role === 'Admin' && (
                        <Grid item xs={12}>
                            <Button component={Link} to='/create-task'
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    height: '100%',
                                }}
                            >
                                Create task
                            </Button>
                        </Grid>
                    )}
                </Grid>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Assignee</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 && tasks.map((task, index) => {
                                return (
                                    <TableRow key={index} hover component={Link} to={`/task-detail/${task.id}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Typography sx={{
                                                fontSize: '14px',
                                                fontWeight: 500
                                            }}>
                                                Task {task.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {task.title}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    sx={{ mr: 1 }}
                                                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${task.assignees.avatar}`}
                                                />
                                                <Box>
                                                    <Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>
                                                        {task.assignees.fullName}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '15px', color: '#666' }}>
                                                        {task.assignees.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(task.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabel[task.status]}
                                                color={statusColors[task.status]}
                                                size='small'
                                            />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Tooltip title="Task detail">
                                                    <IconButton component={Link} to={`/task-detail/${task.id}`}>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {tasks.length == 0 && (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                                        No data found
                                    </TableCell>
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
    )
}
