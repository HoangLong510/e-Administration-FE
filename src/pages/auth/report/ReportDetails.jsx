import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { updateReportStatus, getUserApi } from "./service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskIcon from "@mui/icons-material/Task";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export default function ReportDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const { state } = useLocation();
  const { report } = state || {};
  const [isInProgress, setIsInProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response.success && response.user) {
          setRole(response.user.role);
        } else {
          dispatch(
            setPopup({ type: "error", message: "Failed to fetch user data" })
          );
        }
      } catch (error) {
        dispatch(
          setPopup({ type: "error", message: "Error fetching user data" })
        );
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (!report) {
    } else {
      if (report.status === "InProgress") {
        setIsInProgress(false);
      }
    }
  }, [report]);

  const handleStatusChange = () => {
    if (report && report.status === "Pending") {
      report.status = "InProgress";
      setIsInProgress(true);
    }
  };

  const handleBack = () => {
    navigate("/report");
  };

  const handleCreateTask = async () => {
    if (report && isInProgress) {
      setLoading(true);
      try {
        const response = await updateReportStatus(report.id, 1);
        if (response && response.success) {
          navigate("/create-task", { state: { reportId: report.id } });
        } else {
          dispatch(
            setPopup({
              type: "error",
              message: response?.message || "Error creating task!",
            })
          );
        }
      } catch (error) {
        dispatch(
          setPopup({
            type: "error",
            message: error.message || "Error creating task!",
          })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!report) {
    return (
      <StyledPaper elevation={3}>
        <Typography variant="h6" color="error" align="center">
          Report not found.
        </Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper elevation={8}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Report Details
            </Typography>
            <Chip
              label={report.status}
              color={report.status === "Pending" ? "warning" : "success"}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{report.title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Sent by {report.senderFullName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{report.content}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            Created At: {new Date(report.creationTime).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {report?.images?.length > 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Attached Images
              </Typography>
              <Grid container spacing={2}>
                {report.images.map((image, index) => (
                  <Grid item key={index}>
                    <img
                      src={`${
                        import.meta.env.VITE_SERVER_URL
                      }/uploads/${image}`}
                      alt={`Attachment ${index + 1}`}
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No images attached.
            </Typography>
          )}
        </Grid>

        {role === "Admin" && report.status === "Pending" && (
          <Grid item xs={12}>
            <StyledButton
              variant="contained"
              onClick={handleStatusChange}
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Move to In Progress"}
            </StyledButton>
          </Grid>
        )}
        {role === "Admin" && isInProgress && (
          <Grid item xs={12}>
            <StyledButton
              variant="contained"
              onClick={handleCreateTask}
              color="secondary"
              fullWidth
              startIcon={<TaskIcon />}
            >
              Create Task
            </StyledButton>
          </Grid>
        )}
        <Grid item xs={12}>
          <StyledButton
            variant="outlined"
            onClick={handleBack}
            color="primary"
            fullWidth
            startIcon={<ArrowBackIcon />}
          >
            Back to Reports List
          </StyledButton>
        </Grid>
      </Grid>
    </StyledPaper>
  );
}
