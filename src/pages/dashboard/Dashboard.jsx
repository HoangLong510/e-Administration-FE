import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { Business, Group, Devices, Report } from "@mui/icons-material";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import {
  fetchTotalUsers,
  fetchTotalPendingReports,
  fetchLabsStatusSummary,
  fetchReportsForCurrentYear,
} from "./service";

const Dashboard = () => {
  const theme = useTheme();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPendingReports, setTotalPendingReports] = useState(0);
  const [activeLabs, setActiveLabs] = useState(0);
  const [inactiveLabs, setInactiveLabs] = useState(0);
  const [reportCounts, setReportCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    const getLabsStatus = async () => {
      const result = await fetchLabsStatusSummary();
      if (result.success) {
        setActiveLabs(result.data.activeCount);
        setInactiveLabs(result.data.inactiveCount);
      } else {
        console.error(result.message);
      }
    };

    const getReportsForCurrentYear = async () => {
      const result = await fetchReportsForCurrentYear();
      if (result.success) {
        setReportCounts(result.data);
      } else {
        console.error(result.message);
      }
      setIsLoading(false);
    };

    getTotalUsers();
    getTotalPendingReports();
    getLabsStatus();
    getReportsForCurrentYear();
  }, []);

  const pieData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "# of Labs",
        data: [activeLabs, inactiveLabs],
        backgroundColor: ["rgba(76, 175, 80, 0.6)", "rgba(244, 67, 54, 0.6)"],
        borderColor: ["rgba(76, 175, 80, 1)", "rgba(244, 67, 54, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Reports Count",
        data: reportCounts,
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: color,
        color: "white",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {React.cloneElement(icon, { fontSize: "large" })}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.default,
        p: 4,
        borderRadius: 2,
        boxShadow: theme.shadows[5],
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Labs"
            value={activeLabs}
            icon={<Business />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<Group />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Software Expiring Soon"
            value={30}
            icon={<Devices />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reports Pending"
            value={totalPendingReports}
            icon={<Report />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%", boxShadow: theme.shadows[3] }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Lab Status Distribution
            </Typography>
            <Box
              sx={{
                height: 350,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : (
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          font: {
                            size: 16,
                          },
                        },
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%", boxShadow: theme.shadows[3] }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Monthly Reports Overview
            </Typography>
            <Box sx={{ height: 400, width: "100%" }}>
              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : (
                <Line data={lineData} options={options} />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
