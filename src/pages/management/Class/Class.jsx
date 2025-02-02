import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { useDebounce } from "use-debounce";

import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import regex from "~/utils/regex";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import {
  getAllClasses,
  addClass,
  deleteClass,
  getClassById,
  updateClass,
  getUsersByClassId,
} from "./service";

// Component thêm lớp học
function AddClassForm({ onAddClass, fetchClasses, isClassNameExists }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim()) {
      if (isClassNameExists(name)) {
        const dataPopup = {
          type: "error",
          message: `Class "${name}" already exists!`,
        };
        dispatch(setPopup(dataPopup));
        return;
      }

      const result = await addClass({ name });
      if (result.success) {
        onAddClass(result.data);
        setName("");

        const dataPopup = {
          type: "success",
          message: `Class "${name}" has been added successfully!`,
        };
        dispatch(setPopup(dataPopup));

        await fetchClasses();
      } else {
        const dataPopup = {
          type: "error",
          message: result.message,
        };
        dispatch(setPopup(dataPopup));
      }
    } else {
      const dataPopup = {
        type: "error",
        message: "Class name cannot be empty!",
      };
      dispatch(setPopup(dataPopup));
    }
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    if (!regex.className.pattern.test(newName.trim())) {
      setNameError(regex.className.message);
    } else {
      setNameError("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={10}>
          <TextField
            label="Class Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            error={!!nameError}
            helperText={nameError}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            disabled={!!nameError}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

// Component hiển thị danh sách lớp học
function ClassManagement() {
  const [classNameError, setClassNameError] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchClasses = async () => {
    const result = await getAllClasses({ search, page, pageSize });
    if (result.success) {
      setClasses(result.data);
      setTotalPages(result.pagination.totalPages);
    } else {
      setClasses([]);
      setTotalPages(1);
      const dataPopup = {
        type: "error",
        message: result.message || "Unable to get class data!",
      };
      dispatch(setPopup(dataPopup));
    }
  };

  const [debouncedSearch] = useDebounce(search, 500);
  useEffect(() => {
    fetchClasses();
  }, [page, debouncedSearch, pageSize]);

  const isClassNameExists = (name, id) => {
    return classes.some(
      (cls) => cls.name.toLowerCase() === name.toLowerCase() && cls.id !== id
    );
  };

  const handleAddClass = async () => {
    await fetchClasses();
  };

  const handleDelete = async () => {
    if (classToDelete) {
      const result = await deleteClass(classToDelete);
      if (result.success) {
        const updatedClasses = classes.filter(
          (cls) => cls.id !== classToDelete
        );

        const totalRecords = updatedClasses.length;
        const totalPages = Math.ceil(totalRecords / pageSize);

        setClasses(updatedClasses);
        setTotalPages(totalPages);

        if (totalRecords === 0) {
          setPage(1);
        } else if (page > totalPages) {
          setPage(totalPages);
        }

        const dataPopup = {
          type: "success",
          message: "Class has been deleted successfully!",
        };
        dispatch(setPopup(dataPopup));
      } else {
        const dataPopup = {
          type: "error",
          message: result.message,
        };
        dispatch(setPopup(dataPopup));
      }
      setOpenConfirmDialog(false);
      setClassToDelete(null);
    }
  };

  const handleOpenConfirmDialog = (id) => {
    setClassToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setTimeout(() => {
      setClassToDelete(null);
    }, 200);
  };

  const handleOpenDialog = async (id) => {
    const result = await getClassById(id);

    if (result.success) {
      setSelectedClass(result.data);

      const usersResult = await getUsersByClassId(id);

      if (usersResult.success) {
        const userCount = Array.isArray(usersResult.data)
          ? usersResult.data.length
          : 0;
        setUserCount(userCount);
      } else {
        console.log("Error getting users:", usersResult.message);
        setUserCount(0);
      }

      setOpenDialog(true);
    } else {
      dispatch(
        setPopup({
          type: "error",
          message: result.message,
        })
      );
      setOpenDialog(false);
    }
  };

  const handleSaveChanges = async () => {
    const originalClassName = classes.find(
      (cls) => cls.id === selectedClass.id
    )?.name;
    if (selectedClass.name === originalClassName) {
      dispatch(setPopup({ type: "warning", message: "No changes were made!" }));
      setOpenDialog(false);
      return;
    }

    if (!selectedClass.name.trim()) {
      dispatch(
        setPopup({ type: "error", message: "Class name cannot be empty!" })
      );
      setOpenDialog(false);
      return;
    }

    if (isClassNameExists(selectedClass.name, selectedClass.id)) {
      dispatch(
        setPopup({
          type: "error",
          message: `This class name "${selectedClass.name}" already exists!`,
        })
      );
      setOpenDialog(false);
      return;
    }

    const result = await updateClass(selectedClass.id, selectedClass);
    if (result.success) {
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === selectedClass.id ? { ...cls, ...selectedClass } : cls
        )
      );
      dispatch(
        setPopup({
          type: "success",
          message: `Class "${selectedClass.name}" updated successfully!`,
        })
      );
      setOpenDialog(false);
      setSelectedClass(null);
    } else {
      dispatch(setPopup({ type: "error", message: result.message }));
    }

  };

  const handleChangeClassName = (e) => {
    const newName = e.target.value;
    setSelectedClass({
      ...selectedClass,
      name: newName,
    });

    if (!regex.className.pattern.test(newName.trim())) {
      setClassNameError(regex.className.message);
    } else {
      setClassNameError("");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClass(null);
    setClassNameError("");
  };

  const handleClassClick = (id) => {
    navigate(`/management/class/${id}/users`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        padding: "40px 30px",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#000",
            marginBottom: "10px",
          }}
        >
          Class Management
        </Typography>

        <TextField
          label="Search Classes"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ marginBottom: "12px", width: "500px" }}
        />

        <AddClassForm
          onAddClass={handleAddClass}
          fetchClasses={fetchClasses}
          isClassNameExists={isClassNameExists}
        />

        <TableContainer component={Paper} style={{ marginTop: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ display: "none" }}>ID</TableCell>
                <TableCell sx={{ width: "70%", pl: 7 }}>Class Name</TableCell>
                <TableCell sx={{ width: "20%", pl: 5 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell style={{ display: "none" }}>{cls.id}</TableCell>
                  <TableCell
                    sx={{ pl: 7 }}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClassClick(cls.id)}
                  >
                    {cls.name}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(cls.id)}
                      style={{ marginRight: "10px" }}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenConfirmDialog(cls.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        />

        {/* Dialog chỉnh sửa lớp học */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Class Information</DialogTitle>
          <DialogContent>
            <TextField
              label="Class Name"
              value={selectedClass?.name || ""}
              onChange={handleChangeClassName}
              fullWidth
              variant="outlined"
              size="medium"
              margin="normal"
              error={!!classNameError}
              helperText={classNameError}
            />
            <Typography variant="body1">Total Users: {userCount}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              variant="contained"
              style={{ marginRight: "10px" }}
              disabled={!!classNameError}
            >
              Save
            </Button>
            <Button
              onClick={handleCloseDialog}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog xác nhận xóa lớp học */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete the class{" "}
              <strong style={{ color: "red" }}>
                {classToDelete
                  ? classes.find((cls) => cls.id === classToDelete)?.name
                  : ""}
              </strong>
              ? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ClassManagement;
