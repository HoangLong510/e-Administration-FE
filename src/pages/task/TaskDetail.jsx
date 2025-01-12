import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Slide,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { cancelTaskApi, changeTaskStatusApi, getTaskByIdApi } from './service'
import { setPopup } from '~/libs/features/popup/popupSlice'
import EditIcon from '@mui/icons-material/Edit'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function TaskDetail() {
    const { taskId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loading = useSelector(state => state.loading.value)
    const user = useSelector(state => state.user.value)

    const [task, setTask] = useState()

    const handleGetTaskById = async () => {
        dispatch(setLoading())
        const res = await getTaskByIdApi(taskId)
        dispatch(clearLoading())

        if (res.success) {
            setTask(res.data)
        } else {
            navigate('/task')
        }
    }

    const handleChangeTaskStatus = async () => {
        dispatch(setLoading())
        const res = await changeTaskStatusApi(taskId)
        dispatch(clearLoading())
        if (res.success) {
            setTask(res.data)
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

    const handleCancelTask = async () => {
        dispatch(setLoading())
        const res = await cancelTaskApi(taskId)
        dispatch(clearLoading())

        if (res.success) {
            setTask(res.data)
            handleCloseTaskCancel()
        } else {
            navigate('/task')
        }
    }

    useEffect(() => {
        handleGetTaskById()
    }, [])

    const [openTaskCancel, setOpenTaskCancel] = React.useState(false)

    const handleClickOpenTaskCancel = () => {
        setOpenTaskCancel(true)
    }

    const handleCloseTaskCancel = () => {
        setOpenTaskCancel(false)
    }

    return (
        <Box sx={{
            width: '100%',
            bgcolor: '#fff',
            padding: '40px 30px',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100%'
        }}>
            <Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    flexDirection: { xs: 'column', md: 'row' }
                }}>
                    <Box>
                        <Typography sx={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#000'
                        }}>
                            Task Detail
                        </Typography>
                        <Typography sx={{
                            mb: { xs: '10px', md: '0px' },
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            Your task
                        </Typography>
                    </Box>
                    <Button sx={{
                        textTransform: 'none',
                        width: { xs: '100%', md: 'auto' }
                    }}
                        component={Link}
                        to="/task"
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                    >
                        Back to Tasks
                    </Button>
                </Box>

                <Divider sx={{ my: 3, mb: 4 }} />

                <Typography sx={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#000',
                    mb: '10px'
                }}>
                    #{task?.id}. {task?.title}
                </Typography>
                <Typography sx={{
                    mb: '20px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    {task?.content}
                </Typography>
            </Box>

            <Box>
                <Divider sx={{ my: 3, mb: 4 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box sx={{ mb: '20px' }}>
                        <Box display="flex" alignItems="center">
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#000'
                                }}>
                                    Assignees:
                                </Typography>
                                <Typography sx={{
                                    ml: 1,
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    {task?.assignees?.fullName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#000'
                                }}>
                                    Created At:
                                </Typography>
                                <Typography sx={{
                                    ml: 1,
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    {new Date(task?.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                            {task && task.complatedAt && (
                                <Box sx={{ display: 'flex', mt: 1 }}>
                                    <Typography sx={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#000'
                                    }}>
                                        Completed At:
                                    </Typography>
                                    <Typography sx={{
                                        ml: 1,
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        {new Date(task?.complatedAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#000'
                                }}>
                                    Status:
                                </Typography>
                                <Chip
                                    sx={{ ml: 1 }}
                                    size="small"
                                    label={statusLabel[task?.status]}
                                    color={statusColors[task?.status]}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    {task && task.status === 'Pending' && user.data.role !== 'Admin' && (
                        <Button
                            onClick={() => handleChangeTaskStatus()}
                            disabled={loading}
                            variant="contained"
                            startIcon={<TaskAltIcon />}
                            color='info'
                        >
                            In Progress
                        </Button>
                    )}
                    {task && task.status === 'InProgress' && user.data.role !== 'Admin' && (
                        <Button
                            onClick={() => handleChangeTaskStatus()}
                            disabled={loading}
                            variant="contained"
                            startIcon={<TaskAltIcon />}
                        >
                            Completed
                        </Button>
                    )}
                    {task && task.status !== 'Canceled' && task.status !== 'Completed' && user.data.role === 'Admin' && (
                        <Button
                            component={Link}
                            to={`/edit-task/${task.id}`}
                            variant="contained"
                            startIcon={<EditIcon />}
                        >
                            Edit Task
                        </Button>
                    )}
                    {task && task.status !== 'Canceled' && user.data.role === 'Admin' && (
                        <Button
                            onClick={() => handleClickOpenTaskCancel()}
                            variant="contained"
                            color='error'
                            startIcon={<CancelIcon />}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </Box>

            <React.Fragment>
                <Dialog
                    open={openTaskCancel}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseTaskCancel}
                    aria-describedby="task-cancel"
                >
                    <DialogTitle sx={{
                        color: 'error.main'
                    }}>
                        Cancel
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="task-cancel">
                            Are you sure you want to cancel this task?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseTaskCancel}
                            color='error'
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => handleCancelTask()}
                            color='error'
                            variant="contained"
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </Box>
    )
}
