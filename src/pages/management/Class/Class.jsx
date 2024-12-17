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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import {
  getAllClasses,
  addClass,
  deleteClass,
  getClassById,
  updateClass,
} from "./service";

// Component thêm lớp học
function AddClassForm({ onAddClass, fetchClasses }) {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim()) {
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

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={10}>
          <TextField
            label="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
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
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
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

  const isClassNameExists = (name) => {
    return classes.some((cls) => cls.name.toLowerCase() === name.toLowerCase());
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

        if (totalRecords === 0) {
          setPage(1);
        } else if (page > totalPages) {
          setPage(totalPages);
        }

        setClasses(updatedClasses);
        setTotalPages(totalPages);

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
    if (!selectedClass.name.trim()) {
      dispatch(
        setPopup({
          type: "error",
          message: "Class name cannot be empty!",
        })
      );
      setOpenDialog(false);
      return;
    }

    if (isClassNameExists(selectedClass.name)) {
      dispatch(
        setPopup({
          type: "error",
          message: "This class name already exists!",
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
      dispatch(
        setPopup({
          type: "error",
          message: result.message,
        })
      );
    }
  };

  const handleChangeClassName = (e) => {
    setSelectedClass({
      ...selectedClass,
      name: e.target.value,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClass(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
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

      <AddClassForm onAddClass={handleAddClass} fetchClasses={fetchClasses} />

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
                <TableCell sx={{ pl: 10 }}>{cls.name}</TableCell>
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
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
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
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            variant="contained"
            style={{ marginRight: "10px" }}
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
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
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
    </Container>
  );
}

export default ClassManagement;
