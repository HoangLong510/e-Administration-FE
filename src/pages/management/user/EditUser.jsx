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
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/libs/features/popup/popupSlice'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import regex from '~/utils/regex'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { editUserApi, getUserApi } from './service'

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

export default function EditUser() {
	const { userId } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const today = new Date()
	today.setDate(today.getDate() - 1)
	const yesterday = today.toISOString().split('T')[0]

	const [formData, setFormData] = useState({
		id: userId,
		fullName: "",
		username: "",
		email: "",
		phone: "",
		address: "",
		dateOfBirth: "",
		gender: "Other",
		role: "",
		classId: null,
		departmentId: null,
		isActive: true,
	})

	const [touched, setTouched] = useState({
		fullName: false,
		username: false,
		email: false,
		phone: false,
		address: false,
		dateOfBirth: false,
		role: false
	})

	const [errors, setErrors] = useState({
		fullName: "",
		username: "",
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

	const handleGetUser = async () => {
		dispatch(setLoading())
		const res = await getUserApi(userId)
		if (res.success) {
			const date = new Date(res.user.dateOfBirth)
			const formattedDate = date.toLocaleDateString('en-CA')

			setFormData({
				...res.user,
				dateOfBirth: formattedDate
			})
			dispatch(clearLoading())
		} else {
			dispatch(setPopup({ type: 'error', message: res.message }))
			dispatch(clearLoading())
		}
	}

	useEffect(() => {
		handleGetUser()
	}, [])

	const handleEditUser = async (event) => {
		event.preventDefault()

		if (validateAllFields()) {
			dispatch(setLoading())
			const res = await editUserApi(formData)
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
						Edit user
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
			<form onSubmit={handleEditUser}>
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
									formData.classId = null
									formData.departmentId = null
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
						<Grid item xs={12} sm={6}>
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
									<MenuItem value={null}>--- select class ---</MenuItem>
									<MenuItem value={1}>Class1</MenuItem>
									<MenuItem value={2}>Class2</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					)}
					{formData.role && formData.role !== 'Admin' && formData.role !== 'Student' && (
						<Grid item xs={12} sm={6}>
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
									<MenuItem value={null}>--- select department ---</MenuItem>
									<MenuItem value={1}>department1</MenuItem>
									<MenuItem value={2}>department2</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					)}
					<Grid item xs={12} sm={formData.role !== 'Admin' ? 6 : 12}>
						<FormControl fullWidth>
							<InputLabel id="status-label">Status</InputLabel>
							<Select
								labelId="status-label"
								name="isActive"
								value={formData.isActive}
								onChange={handleInputChange}
								onBlur={handleBlur}
								label="Status"
							>
								<MenuItem value={true}>Active</MenuItem>
								<MenuItem value={false}>Disable</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="large"
							startIcon={<EditIcon />}
							sx={{ mt: 2, textTransform: 'none' }}
						>
							Update
						</Button>
					</Grid>
				</Grid>
			</form>
		</Box>
	)
}
