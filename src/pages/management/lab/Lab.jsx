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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Error,
  Search as SearchIcon,
} from "@mui/icons-material";

import { getAllLabs, createLab, updateLab, deleteLab } from "./service";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice";

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
  const dispatch = useDispatch();

  const fetchLabs = useCallback(async () => {
    try {
      dispatch(setLoading());
      const res = await getAllLabs();
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
      const matchesSearch = lab.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
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
      dispatch(setLoading());
      const res = await createLab({ name: newName, status: newStatus });
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
      dispatch(setLoading());
      await updateLab(editingLab.id, editingLab);
      dispatch(setPopup({ type: "success", message: "Lab updated" }));
      fetchLabs();
      setIsDialogOpen(false);
      setEditingLab(null);
    } catch (error) {
      console.error("Error updating lab:", error);
      dispatch(setPopup({ type: "error", message: "Failed to update lab" }));
    } finally {
      dispatch(clearLoading());
    }
  };

  const handleDeleteLab = async (id) => {
    try {
      dispatch(setLoading());
      await deleteLab(id);
      dispatch(setPopup({ type: "success", message: "Lab deleted" }));
      fetchLabs();
    } catch (error) {
      console.error("Error deleting lab:", error);
      dispatch(setPopup({ type: "error", message: "Failed to delete lab" }));
    } finally {
      dispatch(clearLoading());
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (lab) => {
    setEditingLab(lab);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingLab(null);
  };

  const getStatusChipProps = (status) => ({
    label: status ? "In Use" : "Under Maintenance",
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
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value={true}>In Use</MenuItem>
                    <MenuItem value={false}>Under Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2} >
                <Button sx={{ height: "100%"}}
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
            <Tab
              label={`In Use (${labs.filter((lab) => lab.status).length})`}
            />
            <Tab
              label={`Under Maintenance (${
                labs.filter((lab) => !lab.status).length
              })`}
            />
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLabs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell>{lab.name}</TableCell>
                    <TableCell align="center">
                      <Chip
                        {...getStatusChipProps(lab.status)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(lab)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteLab(lab.id)}
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
              <TextField
                label="Lab Name"
                value={editingLab.name}
                onChange={(e) =>
                  setEditingLab({ ...editingLab, name: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingLab.status}
                  onChange={(e) =>
                    setEditingLab({ ...editingLab, status: e.target.value })
                  }
                >
                  <MenuItem value={true}>In Use</MenuItem>
                  <MenuItem value={false}>Under Maintenance</MenuItem>
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
    </Container>
  );
}

export default LabManager;
