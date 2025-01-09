import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  TablePagination,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./service";
import { useDispatch } from "react-redux";
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice";

function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [newName, setNewName] = useState("");
  const [newHod, setNewHod] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // State cho modal xác nhận
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const dispatch = useDispatch();

  const fetchDepartments = useCallback(async () => {
    try {
      dispatch(setLoading());
      const res = await getAllDepartments(searchQuery, sortBy);
      setDepartments(res.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      dispatch(clearLoading());
    }
  }, [dispatch, searchQuery, sortBy]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setConfirmAction(() => async () => {
      try {
        dispatch(setLoading());
        const res = await createDepartment({
          name: newName,
          hod: newHod,
          description: newDescription,
        });
        if (res.success) {
          setNewName("");
          setNewHod("");
          setNewDescription("");
          fetchDepartments();
        }
      } catch (error) {
        console.error("Error creating department:", error);
      } finally {
        dispatch(clearLoading());
      }
    });
    setConfirmData(null);
  };

  const handleEditDepartment = () => {
    setShowConfirmModal(true);
    setConfirmAction(() => async () => {
      try {
        dispatch(setLoading());
        await updateDepartment(editingDepartment.id, editingDepartment);
        fetchDepartments();
        setIsDialogOpen(false);
        setEditingDepartment(null);
      } catch (error) {
        console.error("Error updating department:", error);
      } finally {
        dispatch(clearLoading());
      }
    });
    setConfirmData(editingDepartment);
  };

  const handleDeleteDepartment = (id) => {
    setShowConfirmModal(true);
    setConfirmAction(() => async () => {
      try {
        dispatch(setLoading());
        await deleteDepartment(id);
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        dispatch(clearLoading());
      }
    });
    setConfirmData({ id });
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction(confirmData);
    }
    setShowConfirmModal(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingDepartment(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Management Departments
        </Typography>
  
        {/* Add Department Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleAddDepartment}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Department Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="HOD (User ID)"
                  value={newHod}
                  onChange={(e) => setNewHod(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  sx={{ height: "100%" }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Add Department
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
  
        {/* Search and Filter */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search by Department Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort by"
              >
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
  
        {/* Department List Table */}
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }}>Department Name</TableCell>
                <TableCell align="center" sx={{ width: "140px" }}>
                  HOD
                </TableCell>
                <TableCell sx={{ width: "30%", wordWrap: "break-word", maxWidth: "200px" }}>
                  Description
                </TableCell>
                <TableCell align="right" sx={{ width: "15%" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell align="center">{department.hod}</TableCell>
                    <TableCell sx={{ wordWrap: "break-word", maxWidth: "200px" }}>
                      {department.description}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(department)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteDepartment(department.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={departments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
  
        {/* Edit Dialog */}
        {editingDepartment && (
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogContent>
              <TextField
                label="Department Name"
                value={editingDepartment.name}
                onChange={(e) =>
                  setEditingDepartment({
                    ...editingDepartment,
                    name: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="HOD (User ID)"
                value={editingDepartment.hod}
                onChange={(e) =>
                  setEditingDepartment({
                    ...editingDepartment,
                    hod: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={editingDepartment.description}
                onChange={(e) =>
                  setEditingDepartment({
                    ...editingDepartment,
                    description: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleEditDepartment} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        )}
  
        {/* Modal xác nhận */}
        <Modal
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
          open={showConfirmModal}
          onClose={handleCancelConfirm}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showConfirmModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="confirm-modal-title" variant="h6" component="h2">
                Confirm
              </Typography>
              <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
                Are you sure you want to perform this action?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelConfirm}
                >
                  Close
                </Button>
                <Button variant="contained" onClick={handleConfirm} autoFocus>
                  Agree
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Container>
  );
}

export default DepartmentManager;
