import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  Pagination,
  CircularProgress,
  Container,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getReportsByUser, getUserApi, getAllReports } from "./service";

export default function ListReport() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response.success && response.user) {
          setUserId(response.user.id);
          setRole(response.user.role);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError("Error fetching user data");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let response;
        if (role === "Admin") {
          response = await getAllReports({
            category: selectedCategory,
            status: selectedStatus,
            page,
            pageSize,
          });
        } else {
          response = await getReportsByUser({
            senderId: userId,
            category: selectedCategory,
            status: selectedStatus,
            page,
            pageSize,
          });
        }

        if (response?.success && Array.isArray(response?.data)) {
          setReports(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (error) {
        setError("Error occurred while fetching reports");
      } finally {
        setLoading(false);
      }
    };

    if (userId && role) {
      fetchReports();
    }
  }, [userId, role, selectedCategory, selectedStatus, page, pageSize]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewClick = (report) => {
    navigate(`/report-details/${report.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              List of Reports
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            {role !== "Admin" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/create-report")}
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
              >
                Create Report
              </Button>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Tooltip title="Filter by Category">
            <IconButton size="small" sx={{ mr: 1 }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Title
          </Typography>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Machinery">Machinery</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <Tooltip title="Filter by Status">
            <IconButton size="small" sx={{ ml: 1 }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Status
          </Typography>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Sender</TableCell>
                  <TableCell>Creation Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.content}</TableCell>
                    <TableCell>{report.senderFullName}</TableCell>
                    <TableCell>
                      {new Date(report.creationTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={
                          report.status === "Pending" ? "warning" : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewClick(report)}
                        size="small"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
