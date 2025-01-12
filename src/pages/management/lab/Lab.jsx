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
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  TablePagination,
  Menu
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Error,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  PriorityHigh as PriorityHighIcon
} from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import { fetchLabsApi, createLabApi, updateLabApi } from "./service";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice";
import { Link, useParams } from "react-router-dom";
import DisableLab from './DisableLab';
import { checkNameExistsApi, isLabNameUniqueApi } from './service';
function LabManager() {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [editingLab, setEditingLab] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [disableId, setDisableId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLabId, setMenuLabId] = useState(null);
  const [originalLabName, setOriginalLabName] = useState("");
const [validationMessage, setValidationMessage] = useState("");
const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();
  

  const validateField = async (name, value, editingLab) => {
    let error = '';
    if (name === 'name') {
      if (editingLab) {
        const isUnique = await isLabNameUniqueApi(value, editingLab.id);
        if (!isUnique.data.isUnique) {
          error = 'Lab name already exists';
        }
      } else {
        const exists = await checkNameExistsApi(value);
        if (exists.data.exists) {
          error = 'Lab name already exists';
        }
      }
    }
    if (value.trim() === '') {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return error;
  };
  
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuLabId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLabId(null);
  };

  const fetchLabs = useCallback(async () => {
    try {
      dispatch(setLoading());
      const res = await fetchLabsApi();
      setLabs(res.data || []);
    } catch (error) {
      console.error("Error fetching labs:", error);
      dispatch(setPopup({ type: "error", message: "Failed to fetch labs" }));
    } finally {
      dispatch(clearLoading());
    }
  }, [dispatch]);

  useEffect(() => {
    const filtered = labs.filter((lab) => {
      const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (tabValue === 1) return matchesSearch && lab.status === true;
      if (tabValue === 2) return matchesSearch && lab.status === false;
      return matchesSearch;
    });
    setFilteredLabs(filtered);
  }, [labs, searchQuery, tabValue]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleAddLab = async (e) => {
    e.preventDefault();
  
    try {
      const nameExists = await checkNameExistsApi(newName);
      if (nameExists.Exists) {  // Kiểm tra `nameExists.Exists`
        dispatch(setPopup({ type: "error", message: "Lab name already exists" }));
        return;
      }
    } catch (error) {
      console.error("Error checking name exists:", error);
      dispatch(setPopup({ type: "error", message: "Failed to check lab name" }));
      return;
    }
  
    try {
      dispatch(setLoading());
      const res = await createLabApi({ name: newName, status: newStatus });
      if (res.success) {
        dispatch(setPopup({ type: "success", message: res.message }));
        fetchLabs();
        setNewName("");
        setNewStatus(true);
      } else {
        dispatch(setPopup({ type: "error", message: res.message }));
      }
    } catch (error) {
      console.error("Error creating lab:", error);
      dispatch(setPopup({ type: "error", message: "Failed to create lab" }));
    } finally {
      dispatch(clearLoading());
    }
  };
  
  
  const handleEditLab = async () => {
    try {
      if (editingLab.name !== originalLabName) {
        const isUnique = await isLabNameUniqueApi(editingLab.name, editingLab.id);
        if (!isUnique.IsUnique) {  
          setValidationMessage("Lab name already exists");
          return;
        }
      }
  
      dispatch(setLoading());
      await updateLabApi(editingLab.id, editingLab);
      dispatch(setPopup({ type: "success", message: "Lab updated" }));
      fetchLabs();
      setIsDialogOpen(false);
      setEditingLab(null);
      setValidationMessage(""); // Reset validation message
    } catch (error) {
      console.error("Error updating lab:", error);
      dispatch(setPopup({ type: "error", message: "Failed to update lab" }));
    } finally {
      dispatch(clearLoading());
    }
  };
  
  
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (lab, event) => {
    setEditingLab(lab);
    setOriginalLabName(lab.name); 
    setIsDialogOpen(true);
  };
  
  const handleDisableLabClick = async (id) => {
    try {
      dispatch(setLoading());
      const res = await disableLabApi(id);
      if (res.success) {
        dispatch(setPopup({ type: "success", message: "Lab disabled" }));
        fetchLabs();  // Gọi lại hàm fetchLabs để làm mới bảng
      } else {
        dispatch(setPopup({ type: "error", message: res.message }));
      }
    } catch (error) {
      console.error("Error disabling lab:", error);
      dispatch(setPopup({ type: "error", message: "Failed to disable lab" }));
    } finally {
      dispatch(clearLoading());
    }
  };
  
  const handleDeleteClick = (id, event) => {
    
    handleDisableLabClick(id);
  };
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = await validateField(name, value, editingLab);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  };
  const handleBlur = async (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = await validateField(name, formData[name], editingLab);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const validationErrors = {};
    for (const key of Object.keys(formData)) {
      validationErrors[key] = await validateField(key, formData[key], editingLab);
    }
  
    if (Object.keys(validationErrors).some(key => validationErrors[key])) {
      setErrors(validationErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
  
    const data = {
      name: formData.name,
      description: formData.description,
      licenseExpire: formData.licenseExpire,
      status: formData.status === 'active',
    };
  
    dispatch(setLoading());
    try {
      let response;
      if (id) {
        response = await updateLabApi(id, data);
      } else {
        response = await createLabApi(data);
      }
      dispatch(clearLoading());
      if (response.success) {
        dispatch(setPopup({ type: 'success', message: id ? 'Lab updated successfully!' : 'Lab added successfully!' }));
        if (!id) {
          setFormData({
            name: '',
            description: '',
            licenseExpire: '',
            status: '',
          });
          setErrors({});
          setTouched({});
        } else {
          navigate('/management/lab');
        }
      } else {
        if (response.errors) {
          setErrors(response.errors);
          setTouched(Object.keys(response.errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        }
        dispatch(setPopup({ type: 'error', message: response.message }));
      }
    } catch (error) {
      console.error('Error response:', error.response);
      dispatch(clearLoading());
      dispatch(setPopup({ type: 'error', message: id ? 'An error occurred while updating the lab.' : 'An error occurred while adding the lab.' }));
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingLab(null);
  };

  const getStatusChipProps = (status) => ({
    label: status ? "Active" : "Disable",
    color: status ? "success" : "error",
    icon: status ? <CheckCircle /> : <Error />,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Management Labs
        </Typography>
  
        {/* Add Lab Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleAddLab}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lab Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="select-status">Status</InputLabel>
                  <Select
                    labelId="select-status"
                    label="Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Disable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  sx={{ height: "40px" }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Add Lab
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
  
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`All (${labs.length})`} />
            <Tab label={`Active (${labs.filter((lab) => lab.status).length})`} />
            <Tab label={`Disable (${labs.filter((lab) => !lab.status).length})`} />
          </Tabs>
        </Box>
  
        {/* Search and Filter */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search by Lab Name..."
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
        </Grid>
  
        {/* Lab List Table */}
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }}>Lab Name</TableCell>
                <TableCell align="center" sx={{ width: "140px" }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ width: "15%" }}>
                  Actions </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLabs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lab) => (
                    <TableRow key={lab.id} sx={{ cursor: "default" }}>
                      <TableCell>{lab.name}</TableCell>
                      <TableCell align="center">
                        <Chip {...getStatusChipProps(lab.status)} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(event) => handleMenuOpen(event, lab.id)}
                          color="primary"
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl) && menuLabId === lab.id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={(event) => handleEditClick(lab, event)}>
                            <EditIcon sx={{ mr: 1 }} /> Edit
                          </MenuItem>
                          {lab.status && (
                            <MenuItem onClick={() => { setDisableId(lab.id); handleMenuClose(); }}>
                              <DeleteIcon sx={{ mr: 1 }} /> Delete
                            </MenuItem>
                          )}
                          <MenuItem component={Link} to={`/management/labdevice/${lab.id}`} onClick={handleMenuClose}>
                            <PriorityHighIcon sx={{ mr: 1 }} /> Details
                          </MenuItem>
                        </Menu>
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
            count={filteredLabs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
  
          {/* Edit Dialog */}
          {editingLab && (
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Edit Lab</DialogTitle>
              <DialogContent>
                {validationMessage && <Alert severity="error">{validationMessage}</Alert>}
                <TextField
                  label="Lab Name"
                  value={editingLab.name}
                  onChange={(e) =>
                    setEditingLab({ ...editingLab, name: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal" variant="outlined" size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingLab.status}
                    onChange={(e) =>
                      setEditingLab({ ...editingLab, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Disable</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleEditLab} color="primary">
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
        <DisableLab disableId={disableId} setDisableId={setDisableId} fetchLabs={fetchLabs} />
      </Container>
    );
  }
  
  export default LabManager;
  
  
