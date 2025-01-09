import React, { useState, useCallback, useEffect } from 'react'
import {
    Box,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    FormHelperText
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { createUserApi, getAllClassesApi, getAllDepartmentsApi } from './service'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/libs/features/popup/popupSlice'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import regex from '~/utils/regex'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
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

export default function CreateUser() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const today = new Date()
    today.setDate(today.getDate() - 1)
    const yesterday = today.toISOString().split('T')[0]

    const [classes, setClasses] = useState([])
    const [departments, setDepartments] = useState([])

    const handleGetAllClasses = async () => {
        const res = await getAllClassesApi()
        setClasses(res.data)
    }

    const handleGetAllDepartments = async () => {
        const res = await getAllDepartmentsApi()
        setDepartments(res.data)
    }

    useEffect(() => {
        handleGetAllClasses()
        handleGetAllDepartments()
    }, [])

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "Other",
        role: "",
        classId: 0,
        departmentId: 0
    })

    const [touched, setTouched] = useState({
        fullName: false,
        username: false,
        password: false,
        confirmPassword: false,
        email: false,
        phone: false,
        address: false,
        dateOfBirth: false,
        role: false
    })

    const [errors, setErrors] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        role: ""
    })

    const validateField = useCallback((name, value) => {
        let error = ""
        switch (name) {
            case 'fullName':
                if (value.trim() === "") {
                    error = "Full name is required"
                } else if (!regex.fullName.pattern.test(value)) {
                    error = regex.fullName.message
                }
                break
            case 'username':
                if (value.trim() === "") {
                    error = "Username is required"
                } else if (!regex.username.pattern.test(value)) {
                    error = regex.username.message
                }
                break
            case 'password':
                if (value.trim() === "") {
                    error = "Password is required"
                } else if (!regex.password.pattern.test(value)) {
                    error = regex.password.message
                }
                break
            case 'confirmPassword':
                if (value.trim() === "") {
                    error = "Confirm password is required"
                } else if (value !== formData.password) {
                    error = "Confirm password and password do not match"
                }
                break
            case 'email':
                if (value.trim() === "") {
                    error = "Email is required"
                } else if (!regex.email.pattern.test(value)) {
                    error = regex.email.message
                }
                break
            case 'phone':
                if (value.trim() === "") {
                    error = "Phone is required"
                } else if (!regex.phone.pattern.test(value)) {
                    error = regex.phone.message
                }
                break
            case 'dateOfBirth':
                if (value.trim() === "") {
                    error = "Date of Birth is required"
                } else {
                    const formatDateOfBirth = new Date(value)
                    const currentDate = new Date()
                    currentDate.setDate(currentDate.getDate() - 1)
                    if (formatDateOfBirth.getTime() >= currentDate.getTime()) {
                        error = "Invalid Date of Birth"
                    }
                }
                break
            case 'role':
                if (value.trim() === "") {
                    error = "Role is required"
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

    const handleCreateUser = async (event) => {
        event.preventDefault()

        if (validateAllFields()) {
            dispatch(setLoading())
            const res = await createUserApi(formData)
            dispatch(clearLoading())

            if (res.success) {
                dispatch(setPopup({ type: 'success', message: res.message }))
                navigate('/management/user')
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
                        Create user
                    </Typography>
                    <Typography sx={{
                        mb: { xs: '10px', md: '40px' },
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        User management
                    </Typography>
                </Box>
                <Button sx={{ mb: '40px', textTransform: 'none' }}
                    component={Link}
                    to="/management/user"
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                >
                    Back to Users
                </Button>
            </Box>

            <form onSubmit={handleCreateUser}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="fullName"
                            label="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.fullName}
                            touched={touched.fullName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.username}
                            touched={touched.username}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.password}
                            touched={touched.password}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.email}
                            touched={touched.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="phone"
                            label="Phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.phone}
                            touched={touched.phone}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="address"
                            label="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.address}
                            touched={touched.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomTextField
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.dateOfBirth}
                            touched={touched.dateOfBirth}
                            inputProps={{ max: yesterday }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                label="Gender"
                            >
                                <MenuItem value="Other">Other</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={touched.role && !!errors.role}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={formData.role}
                                onChange={(e) => {
                                    formData.classId = 0
                                    formData.departmentId = 0
                                    handleInputChange(e)
                                }}
                                onBlur={handleBlur}
                                label="Role"
                            >
                                <MenuItem value="">--- select role ---</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Instructor">Instructor</MenuItem>
                                <MenuItem value="HOD">HOD</MenuItem>
                                <MenuItem value="TechnicalStaff">Technical Staff</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                            </Select>
                            {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {formData.role === 'Student' && (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="class-label">Select class</InputLabel>
                                <Select
                                    labelId="class-label"
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    label="Select class"
                                >
                                    <MenuItem value={0}>--- select class ---</MenuItem>
                                    {classes.map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {formData.role && formData.role !== 'Admin' && formData.role !== 'Student' && (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="department-label">Select department</InputLabel>
                                <Select
                                    labelId="department-label"
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    label="Select department"
                                >
                                    <MenuItem value={0}>--- select department ---</MenuItem>
                                    {departments.map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<PersonAddIcon />}
                            sx={{ mt: 2, textTransform: 'none' }}
                        >
                            Create User
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

