import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getReportsByUser, getUserApi, getAllReports } from "./service"; // Import getAllReports

export default function ListReport() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
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
          });
        } else {
          response = await getReportsByUser({
            senderId: userId,
            category: selectedCategory,
          });
        }

        if (response?.success && Array.isArray(response?.data)) {
          setReports(response.data);
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
  }, [userId, role, selectedCategory, page]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    const seconds = formattedDate.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#000" }}>
          List of Reports
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-report")}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 2 }}>Filter by Category:</Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Education">Education</MenuItem>
          <MenuItem value="Machinery">Machinery</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </Box>

      {loading && <CircularProgress />}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Creation Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.content}</TableCell>
                  <TableCell>{report.senderFullName}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>{formatDate(report.creationTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination count={10} page={page} onChange={handlePageChange} />
      </Box>
    </Box>
  );
}
