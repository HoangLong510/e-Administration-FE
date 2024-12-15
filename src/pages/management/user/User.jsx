import { Alert, Avatar, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

const StatusRender = ({ active }) => {
	if (active) {
		return (
			<Alert severity="success">
				Active
			</Alert>
		)
	}
	return (
		<Alert severity="error">
			Banned
		</Alert>
	)
}

export default function User() {
	return (
		<Box sx={{
			width: '100%',
		}}>
			<TableContainer component={Paper}>
				<Table aria-label="user-table">
					<TableHead>
						<TableRow>
							<TableCell>

							</TableCell>
							<TableCell colSpan={5}></TableCell>
						</TableRow>
					</TableHead>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left">Phone</TableCell>
							<TableCell align="left">Role</TableCell>
							<TableCell align="left" width={150} sx={{ fontWeight: 500 }}>
								Status
							</TableCell>
							<TableCell align="right" width={120}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow hover
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								<Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
									<Avatar sx={{ height: '30px', width: '30px' }} />
									Administrator
								</Box>
							</TableCell>
							<TableCell align="left">admin@gmail.com</TableCell>
							<TableCell align="left">+84797456569</TableCell>
							<TableCell align="left">Admin</TableCell>
							<TableCell align="left">
								<StatusRender active={false} />
							</TableCell>
							<TableCell align="right">
								<IconButton>
									<EditRoundedIcon />
								</IconButton>
								<IconButton>
									<DeleteRoundedIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}
