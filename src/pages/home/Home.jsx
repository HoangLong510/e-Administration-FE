import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { Business, Group, Devices, Report } from "@mui/icons-material";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { fetchTotalUsers, fetchTotalPendingReports } from "./service";

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  datasets: [
    {
      label: "Lab Usage",
      data: [30, 50, 40, 60, 70, 50, 40, 80, 60],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const pieData = {
  labels: ["Active", "Inactive"],
  datasets: [
    {
      label: "# of Labs",
      data: [10, 5],
      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPendingReports, setTotalPendingReports] = useState(0);

  useEffect(() => {
    const getTotalUsers = async () => {
      const result = await fetchTotalUsers();
      if (result.success) {
        setTotalUsers(result.totalUsers);
      } else {
        console.error(result.message);
      }
    };

    const getTotalPendingReports = async () => {
      const result = await fetchTotalPendingReports();
      if (result.success) {
        setTotalPendingReports(result.totalPending);
      } else {
        console.error(result.message);
      }
    };

    getTotalUsers();
    getTotalPendingReports();
  }, []);

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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Active Rooms Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{ p: 3, bgcolor: "#0d47a1", color: "white", height: "100%" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Business fontSize="large" />
            </Box>
            <Typography variant="h6" mt={2}>
              Active Labs
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              5
            </Typography>
            <Typography variant="body2" color="lightgreen" mt={1}>
              +10% This Month
            </Typography>
          </Paper>
        </Grid>

        {/* Total Users Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{ p: 3, bgcolor: "#8e24aa", color: "white", height: "100%" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Group fontSize="large" />
            </Box>
            <Typography variant="h6" mt={2}>
              Total Users
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {totalUsers}
            </Typography>
            <Typography variant="body2" color="red" mt={1}>
              -5% This Month
            </Typography>
          </Paper>
        </Grid>

        {/* Devices Expiring Soon Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{ p: 3, bgcolor: "#d32f2f", color: "white", height: "100%" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Devices fontSize="large" />
            </Box>
            <Typography variant="h6" mt={2}>
              Software Expiring Soon
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              30
            </Typography>
            <Typography variant="body2" color="orange" mt={1}>
              +2% This Month
            </Typography>
          </Paper>
        </Grid>

        {/* Reports Pending Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{ p: 3, bgcolor: "#1976d2", color: "white", height: "100%" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Report fontSize="large" />
            </Box>
            <Typography variant="h6" mt={2}>
              Reports Pending
            </Typography>
            <Typography variant="h4" fontWeight="bold">
            {totalPendingReports}
            </Typography>
            <Typography variant="body2" color="yellow" mt={1}>
              -10% This Month
            </Typography>
          </Paper>
        </Grid>

        <Grid container spacing={3} mt={0.5} ml={0.5}>
          {/* Biểu đồ tròn (Pie Chart) */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 3, bgcolor: "#f4f6f8", height: "100%", mt: 2 }}>
              <Typography variant="h6" mb={2}>
                Lab Status Distribution
              </Typography>
              <Pie
                data={pieData}
                width={120}
                height={80}
                options={{ responsive: true }}
              />
            </Paper>
          </Grid>

          {/* Biểu đồ Line */}
          <Grid item xs={12} md={6} lg={8}>
            <Paper sx={{ p: 3, bgcolor: "#f4f6f8", height: "100%", mt: 2 }}>
              <Typography variant="h6" mb={2}>
                Lab Usage Over Time
              </Typography>
              <Line data={lineData} height={140} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
