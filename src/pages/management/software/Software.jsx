import React, { useEffect, useState } from "react";
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
  Grid,
  InputAdornment,
  Pagination,
  InputLabel,
  FormControl,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchSoftwaresApi, SendExpirationNotificationsAPI } from "./service";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice";
import { Link } from "react-router-dom";
import DisableSoftware from "./DisableSoftware";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const RenderStatus = ({ isActive }) => {
  if (isActive) {
    return <Chip label="Active" color="primary" size="small" />;
  }
  return <Chip label="Disable" color="error" size="small" />;
};

export default function Software() {
  const dispatch = useDispatch();
  const [firstRender, setFirstRender] = useState(true);
  const [softwares, setSoftwares] = useState([]);
  const [status, setStatus] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [disableId, setDisableId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSoftwareId, setMenuSoftwareId] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuSoftwareId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuSoftwareId(null);
  };

  const handleStatusFilterChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlefetchSoftwares = async () => {
    const data = {
      status,
      pageNumber: page,
      searchValue,
    };
    if (status !== null) {
      data.status = status;
    }
    dispatch(setLoading());
    const res = await fetchSoftwaresApi(data);
    dispatch(clearLoading());
    console.log(res);
    if (res.success) {
      setSoftwares(res.softwares);
      setTotalPage(res.totalPages);
    } else {
      const dataPopup = {
        type: "error",
        message: res.message,
      };
      dispatch(setPopup(dataPopup));
    }
  };
  const handleSendExpirationNotifications = async () => {
    const response = await SendExpirationNotificationsAPI();
    if (response.success) {
      const dataPopup = {
        type: "success",
        message: "Expiration notifications sent successfully.",
      };
      dispatch(setPopup(dataPopup));
    } else {
      const dataPopup = {
        type: "error",
        message: "An error occurred while sending notifications.",
      };
      dispatch(setPopup(dataPopup));
    }
  };
  
  useEffect(() => {
    handleSendExpirationNotifications();
  }, []);

  useEffect(() => {
    handlefetchSoftwares();
    
  }, [status, page, disableId]);

  useEffect(() => {
    if (!firstRender) {
      setPage(1);
      dispatch(setLoading());
      const handleSearchSoftwares = setTimeout(async () => {
        handlefetchSoftwares();
      }, 500);
      return () => {
        clearTimeout(handleSearchSoftwares);
      };
    } else {
      setFirstRender(false);
    }
  }, [searchValue]);

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
          }}
        >
          List of Softwares
        </Typography>
        <Typography
          sx={{
            mb: "40px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Software management
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-status">Status</InputLabel>
              <Select
                labelId="select-status"
                label="Status"
                value={status}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Disable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              component={Link}
              to="/management/software/add-software"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                height: "100%",
                padding: "10px 20px",
              }}
            >
              New Software
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Software</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>License Expire</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {softwares.length > 0 &&
                softwares.map((software, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "primary.main",
                              fontWeight: 500,
                            }}
                          >
                            {software.name}
                          </Typography>
                          <Typography sx={{ fontSize: "15px", color: "#666" }}>
                            {software.type}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{software.description}</TableCell>
                    <TableCell>
                      {new Date(software.licenseExpire).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <RenderStatus isActive={software.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, software.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          keepMounted
                          open={
                            Boolean(anchorEl) && menuSoftwareId === software.id
                          }
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            component={Link}
                            to={`/management/software/add-software/${software.id}`}
                            onClick={handleMenuClose}
                          >
                            <EditIcon sx={{ mr: 1 }} /> Edit
                          </MenuItem>
                          {status === true && (
                            <MenuItem
                              onClick={() => {
                                setDisableId(software.id);
                                handleMenuClose();
                              }}
                            >
                              <DeleteIcon sx={{ mr: 1 }} /> Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {softwares.length === 0 && (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      <DisableSoftware disableId={disableId} setDisableId={setDisableId} />
    </Box>
  );
}
