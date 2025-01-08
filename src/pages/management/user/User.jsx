import React, { useEffect, useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Select,
	MenuItem,
	TextField,
	Button,
	Typography,
	Box,
	IconButton,
	Tooltip,
	Chip,
	Avatar,
	Grid,
	InputAdornment,
	Pagination,
	InputLabel,
	FormControl,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { fetchUsersApi } from './service'
import { useDispatch } from 'react-redux'
import { setPopup } from '~/libs/features/popup/popupSlice'
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice'
import { Link } from 'react-router-dom'
import DisableUser from './DisableUser'

const RenderStatus = ({ isActive }) => {
	if (isActive) {
		return <Chip label="Active" color="primary" size="small" />
	}
	return <Chip label="Disable" color="error" size="small" />
}

export default function User() {
	const dispatch = useDispatch()
	const [firstRender, setFirstRender] = useState(true)

	const [users, setUsers] = useState([])

	const [role, setRole] = useState('')
	const [active, setActive] = useState(true)
	const [searchValue, setSearchValue] = useState('')
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)

	const [disableId, setDisableId] = useState(null)

	const handleRoleFilterChange = (event) => {
		setRole(event.target.value)
	}

	const handleActiveFilterChange = (event) => {
		setActive(event.target.value)
	}

	const handlePageChange = (event, value) => {
		setPage(value)
	}

	const handlefetchUsers = async () => {
		const data = {
			role,
			isActive: active,
			pageNumber: page,
			searchValue
		}

		dispatch(setLoading())
		const res = await fetchUsersApi(data)
		dispatch(clearLoading())
		console.log(res)
		if (res.success) {
			setUsers(res.users)
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
		handlefetchUsers()
	}, [role, active, page, disableId])

	useEffect(() => {
		if (!firstRender) {
			setPage(1)
			dispatch(setLoading())
			const handleSearchUsers = setTimeout(async () => {
				handlefetchUsers()
			}, 500)
			return () => {
				clearTimeout(handleSearchUsers)
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
					List of users
				</Typography>
				<Typography sx={{
					mb: '40px',
					fontSize: '14px',
					color: '#666'
				}}>
					User management
				</Typography>
				<Grid container spacing={3} sx={{ mb: 3 }}>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth size='small'>
							<InputLabel id="select-role">Role</InputLabel>
							<Select
								labelId="select-roles"
								label="Role"
								value={role}
								onChange={handleRoleFilterChange}
							>
								<MenuItem value="">All</MenuItem>
								<MenuItem value="Admin">Admin</MenuItem>
								<MenuItem value="Instructor">Instructor</MenuItem>
								<MenuItem value="HOD">Head of department</MenuItem>
								<MenuItem value="TechnicalStaff">Technical staff</MenuItem>
								<MenuItem value="Student">Student</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth size='small'>
							<InputLabel id="select-status">Status</InputLabel>
							<Select
								labelId="select-status"
								label="Status"
								value={active}
								onChange={handleActiveFilterChange}
							>
								<MenuItem value={true}>Active</MenuItem>
								<MenuItem value={false}>Disable</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={7} md={5}>
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
									)
								}
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={5} md={3}>
						<Button component={Link} to='/management/user/create'
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
							Create new user
						</Button>
					</Grid>
				</Grid>
				<TableContainer component={Paper} elevation={0}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Status</TableCell>
								<TableCell align="right"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.length > 0 && users.map((user, index) => {
								return (
									<TableRow key={index}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell component="th" scope="row">
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												<Avatar sx={{ mr: 1 }} />
												<Box>
													<Typography sx={{ fontSize: '15px', color: 'primary.main', fontWeight: 500 }}>
														{user.fullName}
													</Typography>
													<Typography sx={{ fontSize: '15px', color: '#666' }}>
														{user.username}
													</Typography>
												</Box>
											</Box>
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.phone}</TableCell>
										<TableCell>{user.role}</TableCell>
										<TableCell>
											<RenderStatus isActive={user.isActive} />
										</TableCell>

										<TableCell align='right'>
											<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
												{user.username !== "admin" && (
													<Tooltip title="Edit">
														<IconButton component={Link} to={`/management/user/edit/${user.id}`}>
															<EditIcon />
														</IconButton>
													</Tooltip>
												)}
												{active && user.username !== "admin" && (
													<Tooltip title="Delete">
														<IconButton onClick={() => {
															setDisableId(user.id)
														}}>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												)}
											</Box>
										</TableCell>
									</TableRow>
								)
							})}
							{users.length == 0 && (
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
			<DisableUser disableId={disableId} setDisableId={setDisableId} />
		</Box>
	)
}
