import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { createTaskApi, getUserForTaskAssigneesApi } from './service'
import { useDispatch } from 'react-redux'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { setPopup } from '~/libs/features/popup/popupSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const CustomTextField = ({ name, label, value, onChange, error, touched, onBlur, type = 'text', ...props }) => {
    return (
        <TextField
            fullWidth
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={touched && !!error}
            helperText={touched && error}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {touched && !error && value && <CheckCircleIcon color="success" />}
                    </InputAdornment>
                ),
            }}
            InputLabelProps={{
                shrink: true,
            }}
            {...props}
        />
    )
}

export default function CreateTask() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const getQueryParam = (name) => {
        const params = new URLSearchParams(location.search)
        return params.get(name)
    }

    const reportId = getQueryParam('reportId')

    const [users, setUsers] = useState([])

    const handleGetUserForTaskAssignees = async () => {
        const res = await getUserForTaskAssigneesApi()
        setUsers(res.data)
    }

    useEffect(() => {
        handleGetUserForTaskAssignees()
    }, [])

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        assigneesId: 0,
        reportId: reportId ? reportId : null
    })

    const [touched, setTouched] = useState({
        title: false,
        content: false,
        assigneesId: false
    })

    const [errors, setErrors] = useState({
        title: "",
        content: "",
        assigneesId: ""
    })

    const validateField = useCallback((name, value) => {
        let error = ""
        switch (name) {
            case 'title':
                if (value.trim() === "") {
                    error = "Title is required"
                }
                break
            case 'content':
                if (value.trim() === "") {
                    error = "Content is required"
                }
                break
            case 'assigneesId':
                if (value === 0) {
                    error = "Assignees is required"
                }
                break
        }
        return error
    }, [formData])

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
        if (touched[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: validateField(name, value)
            }))
        }
    }

    const handleBlur = (event) => {
        const { name } = event.target
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true
        }))
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: validateField(name, formData[name])
        }))
    }

    const validateAllFields = () => {
        const newErrors = {}
        let isValid = true
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key])
            newErrors[key] = error
            if (error) isValid = false
        })
        setErrors(newErrors)
        setTouched(Object.keys(touched).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
        return isValid
    }

    const handleCreateTask = async (event) => {
        event.preventDefault()

        if (validateAllFields()) {
            dispatch(setLoading())
            const res = await createTaskApi(formData)
            dispatch(clearLoading())
            if (res.success) {
                dispatch(setPopup({ type: 'success', message: res.message }))
                if (reportId) {
                    navigate(`/report-details/${reportId}`)
                } else {
                    navigate('/task')
                }
            } else {
                setErrors(res.errors || {})
                setTouched(Object.keys(touched).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
                dispatch(setPopup({ type: 'error', message: res.message }))
            }
        }
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
            justifyContent: 'space-between'
        }}>
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
                        Create Task
                    </Typography>
                    <Typography sx={{
                        mb: { xs: '10px', md: '40px' },
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Task management
                    </Typography>
                </Box>
                <Button sx={{
                    mb: '40px',
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

            <form onSubmit={handleCreateTask}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CustomTextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.title}
                            touched={touched.title}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={touched.assigneesId && !!errors.assigneesId}>
                            <InputLabel id="assignees-label">Assignees</InputLabel>
                            <Select
                                labelId="assignees-label"
                                name="assigneesId"
                                value={formData.assigneesId}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                label="Assignees"
                            >
                                <MenuItem value={0}>--- select assignees ---</MenuItem>
                                {users.length > 0 && users.map(u => {
                                    return (
                                        <MenuItem key={u.id} value={u.id}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Typography>
                                                    {u.fullName}
                                                </Typography>
                                                <Typography sx={{ color: '#777' }}>
                                                    {u.username} ({u.role})
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                            {touched.assigneesId && errors.assigneesId && <FormHelperText>{errors.assigneesId}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextField
                            name="content"
                            label="Content"
                            value={formData.content}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.content}
                            touched={touched.content}
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{
                                mt: 2,
                                textTransform: 'none',
                                borderRadius: '20px'
                            }}
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}
