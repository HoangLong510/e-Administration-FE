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
  ListItem,
  ListItemText,
  List,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import {
  updateReportStatus,
  getUserApi,
  getReport,
  createComment,
} from "./service";
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
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [report, setReport] = useState(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response.success && response.user) {
          setRole(response.user.role);
          setUserId(response.user.id);
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

    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getReport(id);
        if (response?.success) {
          setReport(response.data);
          setComments(response.data.comments || []);
          setTasks(response.data.tasks || []);
        } else {
          setError("Report not found.");
        }
      } catch (err) {
        setError("An error occurred while loading report data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
    fetchUser();
  }, [id]);

  const handleCompleteReport = async () => {
    const allTasksCompleted = report.tasks.every((task) => task.status === 2);

    if (!allTasksCompleted) {
      dispatch(
        setPopup({
          type: "error",
          message: "All tasks must be completed before completing the report.",
        })
      );
      return;
    }

    try {
      setLoading(true);
      const response = await updateReportStatus(report.id, 2);
      if (response?.success) {
        setReport({ ...report, status: 2 });

        dispatch(
          setPopup({
            type: "success",
            message: "Report successfully completed.",
          })
        );
        handleBack();
      } else {
        dispatch(
          setPopup({
            type: "error",
            message: response?.message || "Error completing report",
          })
        );
      }
    } catch (err) {
      dispatch(
        setPopup({
          type: "error",
          message: "An error occurred while completing the report.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "InProgress";
      case 2:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getTitleText = (title) => {
    switch (title) {
      case 0:
        return "Education";
      case 1:
        return "Machinery";
      case 2:
        return "Other";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    if (!report) {
      return;
    }
    if (report.status === 1) {
      setIsInProgress(true);
    }

    const fetchComments = async () => {
      const response = await getReport(report.id);
      if (response.success && Array.isArray(response.data.comments)) {
        setComments(response.data.comments);
      } else {
        dispatch(
          setPopup({ type: "error", message: "Failed to fetch comments" })
        );
      }
    };

    fetchComments();
  }, [report]);

  const handleCommentSubmit = async () => {
    if (commentContent.trim()) {
      try {
        if (!userId) {
          dispatch(setPopup({ type: "error", message: "User ID not found" }));
          return;
        }

        const response = await createComment(report.id, commentContent, userId);

        if (response.success) {
          setComments((prevComments) => [...prevComments, response.data]);
          setCommentContent("");
        } else {
          dispatch(
            setPopup({
              type: "error",
              message: response.message || "Failed to submit comment",
            })
          );
        }
      } catch (error) {
        dispatch(
          setPopup({
            type: "error",
            message: error.message || "Error submitting comment",
          })
        );
      }
    }
  };

  const handleStatusChange = () => {
    if (report && report.status === 0) {
      setIsInProgress(true);
    }
  };

  const handleBack = () => {
    navigate("/report");
  };

  const handleCreateTask = async () => {
    if (report) {
      setLoading(true);
      try {
        if (report.status !== 1 && isInProgress) {
          const response = await updateReportStatus(report.id, 1);
          if (response && response.success) {
            navigate(`/create-task?reportId=${report.id}`);
          } else {
            dispatch(
              setPopup({
                type: "error",
                message: response?.message || "Error creating task!",
              })
            );
          }
        } else {
          navigate(`/create-task?reportId=${report.id}`);
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
    return null;
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
              label={getStatusText(report.status)}
              color={
                report.status === 0
                  ? "warning"
                  : report.status === 1
                  ? "info"
                  : "success"
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <StyledButton
              variant="outlined"
              onClick={handleBack}
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              Back to Reports
            </StyledButton>

            {role === "Admin" && report.status === 0 && !isInProgress && (
              <StyledButton
                variant="contained"
                onClick={handleStatusChange}
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Move to In Progress"
                )}
              </StyledButton>
            )}
            {role === "Admin" && isInProgress && (
              <StyledButton
                variant="contained"
                onClick={handleCreateTask}
                color="secondary"
                startIcon={<TaskIcon />}
              >
                Create Task
              </StyledButton>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{getTitleText(report.title)}</Typography>
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

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} mb={5}>
          {/* Hiển thị danh sách tasks */}
          {tasks?.length > 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <Grid container spacing={2}>
                {tasks.map((task, index) => (
                  <Grid item key={task.id} xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="h6">{task.assigneeFullName}</Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                      >
                        {task.content}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {getStatusText(task.status)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {tasks.every((task) => task.status === 2) &&
                report?.status !== 2 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCompleteReport}
                    >
                      Complete Report
                    </Button>
                  </Box>
                )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No tasks available.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} mb={4}>
        <Divider />
      </Grid>

      {/* Comments Section */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <List>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${comment.userFullName}: ${comment.content}`}
                  secondary={`Posted on: ${new Date(
                    comment.creationTime
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}
        </List>
      </Grid>

      <StyledPaper elevation={8} sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Add a Comment
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write your comment here..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              disabled={!commentContent.trim()}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </StyledPaper>
  );
}
