import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { getUsersByClassId, getClassById } from "./service";

function ListUser() {
  const { classId } = useParams();
  const [users, setUsers] = useState([]);
  const [className, setClassName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassName = async () => {
      const result = await getClassById(classId);
      if (result.success) {
        setClassName(result.data.name);
      }
    };

    const fetchUsers = async () => {
      const result = await getUsersByClassId(classId);
      if (result.success) {
        setUsers(result.data);
      }
    };

    fetchClassName();
    fetchUsers();
  }, [classId]);

  const handleBack = () => {
    navigate("/management/class");
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();

    return `${day}/${month}/${year}`;
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
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Users in Class {className}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          sx={{ marginBottom: "20px" }}
        >
          Back
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ display: "none" }}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Date of Birth</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell style={{ display: "none" }}>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.dateOfBirth ? formatDate(user.dateOfBirth) : "N/A"}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListUser;
