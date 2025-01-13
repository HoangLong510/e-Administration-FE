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
  Search as SearchIcon,
} from "@mui/icons-material";

import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  getUsersByHodAPI,
} from "./service";
import { useDispatch } from "react-redux";
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice";

function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [newName, setNewName] = useState("");
  const [newHod, setNewHod] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To store validation error message

  const dispatch = useDispatch();

  const fetchUsersByHod = useCallback(async () => {
    try {
      dispatch(setLoading());
      const res = await getUsersByHodAPI();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users by HOD:", error);
    } finally {
      dispatch(clearLoading());
    }
  }, []);

  useEffect(() => {
    fetchUsersByHod();
  }, []);

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

    // Validate department name
    const existingDepartment = departments.find(
      (department) => department.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingDepartment) {
      setErrorMessage("Department name already exists.");
      return;
    }

    setActionType("add");
    setOpenConfirmDialog(true);
  };

  const handleUpdateDepartment = () => {
    // Validate department name
    const existingDepartment = departments.find(
      (department) =>
        department.id !== editingDepartment.id &&
        department.name.toLowerCase() === editingDepartment.name.toLowerCase()
    );
    if (existingDepartment) {
      setErrorMessage("Department name already exists.");
      return;
    }

    setActionType("update");
    setOpenConfirmDialog(true);
  };

  const confirmAction = async () => {
    setErrorMessage(""); // Clear any previous error messages

    if (actionType === "add") {
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
    } else if (actionType === "update") {
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
    }
    setOpenConfirmDialog(false);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingDepartment(null);
    setErrorMessage(""); // Clear error message when closing dialog
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
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setErrorMessage(""); // Clear error message on input change
                  }}
                  required
                  fullWidth
                  error={!!errorMessage} // Show error state if errorMessage is not empty
                  helperText={errorMessage} // Display the error message
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel id="HOD-label">Head of Department</InputLabel>
                  <Select
                    labelId="HOD-label"
                    name="newHod"
                    value={newHod}
                    onChange={(e) => setNewHod(e.target.value)}
                    label="Head of Department"
                  >
                    <MenuItem value={0} disabled>
                      --- select HOD ---
                    </MenuItem>
                    {users.length > 0 &&
                      users.map((u) => {
                        return (
                          <MenuItem key={u.id} value={u.id}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography>{u.fullName}</Typography>
                              <Typography sx={{ color: "#777" }}>
                                {u.username} ({u.role})
                              </Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  sx={{
                    height: "80%",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    backgroundColor: "primary.main",
                    color: "#fff",
                    textTransform: "capitalize",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Add
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
                <TableCell
                  sx={{
                    width: "30%",
                    wordWrap: "break-word",
                    maxWidth: "200px",
                  }}
                >
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
                    <TableCell align="center">
                      {department.user.fullName}
                    </TableCell>
                    <TableCell
                      sx={{ wordWrap: "break-word", maxWidth: "200px" }}
                    >
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
                onChange={(e) => {
                  setEditingDepartment({
                    ...editingDepartment,
                    name: e.target.value,
                  });
                  setErrorMessage(""); // Clear error message on input change
                }}
                fullWidth
                margin="normal"
                error={!!errorMessage} // Show error state if errorMessage is not empty
                helperText={errorMessage} // Display the error message
              />
              <FormControl fullWidth>
                <InputLabel id="assignees-label">Assignees</InputLabel>
                <Select
                  labelId="HOD-label"
                  name="newHod"
                  value={editingDepartment.hod}
                  onChange={(e) =>
                    setEditingDepartment({
                      ...editingDepartment,
                      hod: e.target.value,
                    })
                  }
                  label="Select HOD"
                >
                  <MenuItem value={0} disabled>
                    --- select HOD ---
                  </MenuItem>
                  {users.length > 0 &&
                    users.map((u) => {
                      return (
                        <MenuItem key={u.id} value={u.id}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography>{u.fullName}</Typography>
                            <Typography sx={{ color: "#777" }}>
                              {u.username} ({u.role})
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

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
              <Button onClick={handleUpdateDepartment} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>
            Are you sure you want to {actionType === "add" ? "add" : "update"}{" "}
            this department?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={confirmAction} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default DepartmentManager;
