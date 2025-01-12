import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setPopup } from "~/libs/features/popup/popupSlice";
import { useNavigate } from "react-router-dom";
import { createReport, getUserApi } from "./service";

export default function Report() {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserApi();
      if (response.success && response.user) {
        setUserId(response.user.id);
        setRole(response.user.role);
      } else {
        dispatch(
          setPopup({
            type: "error",
            message: "User information not found!",
          })
        );
      }
    };
    fetchUserInfo();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      dispatch(
        setPopup({
          type: "error",
          message: "You need to log in again to generate reports!",
        })
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      dispatch(
        setPopup({
          type: "error",
          message: "Title and content cannot be blank!",
        })
      );
      return;
    }

    const newReport = {
      title,
      content,
      status: "Pending",
      senderId: userId,
      creationTime: new Date().toISOString(),
    };

    setIsLoading(true);

    try {
      const response = await createReport(newReport, images);
      setIsLoading(false);

      if (response.success) {
        dispatch(
          setPopup({
            type: "success",
            message: "Report sent successfully!",
          })
        );
        setTitle("");
        setContent("");
        setImages([]);
        navigate("/report");
      } else {
        dispatch(
          setPopup({
            type: "error",
            message: response.message || "An error occurred while sending the report.",
          })
        );
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(
        setPopup({
          type: "error",
          message: "Server problem, please try again later",
        })
      );
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    navigate("/report");
  };

  const options = [
    { value: "Education", label: "Education" },
    { value: "Machinery", label: "Machinery" },
    { value: "Other", label: "Other" },
    { value: "ExtraTime", label: "ExtraTime" },
  ];

  const filteredOptions =
    role === "HOD"
      ? options.filter((option) => option.value === "ExtraTime")
      : options.filter((option) => option.value !== "ExtraTime");

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Submit a Report
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Title</InputLabel>
                <Select
                  label="Report Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                >
                  {filteredOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Box mt={2}>
                {images.length > 0 && (
                  <Box>
                    <Typography variant="body2">Selected Files:</Typography>
                    <Grid container spacing={2}>
                      {images.map((file, index) => {
                        const imageUrl = URL.createObjectURL(file);
                        return (
                          <Grid item key={index}>
                            <Box position="relative">
                              <img
                                src={imageUrl}
                                alt={`preview-${index}`}
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                                }}
                              />
                              <Box
                                position="absolute"
                                top={-5}
                                right={-5}
                                bgcolor="rgba(0,0,0,0.5)"
                                borderRadius="50%"
                                p={0.5}
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                                }}
                              >
                                <Typography
                                  color="white"
                                  variant="body2"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  X
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" type="submit" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
