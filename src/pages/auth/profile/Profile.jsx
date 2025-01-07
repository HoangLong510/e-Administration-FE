import React, { useEffect, useState, useCallback } from "react";
import regex from "~/utils/regex";
import { useDispatch } from "react-redux";
import { getProfileApi, updateProfileApi, getClassById } from "./service";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { setPopup } from "~/libs/features/popup/popupSlice";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
  });
  const [initialData, setInitialData] = useState({}); 
  const [avatarFile, setAvatarFile] = useState(null);
  const [className, setClassName] = useState(null);
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    address: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileApi();
        setLoading(false);

        if (response.success) {
          setProfile(response.user);
          setInitialData({
            phone: response.user.phone,
            email: response.user.email,
            address: response.user.address,
          });
          setFormData({
            phone: response.user.phone,
            email: response.user.email,
            address: response.user.address,
          });
        } else {
          dispatch(
            setPopup({
              type: "error",
              message:
                response.message ||
                "An error occurred while fetching the profile.",
            })
          );
        }
      } catch (error) {
        setLoading(false);
        dispatch(
          setPopup({
            type: "error",
            message: "Failed to fetch profile. Please try again later.",
          })
        );
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.classId) {
      const fetchClassName = async () => {
        try {
          const classResponse = await getClassById(profile.classId);
          if (classResponse.success) {
            setClassName(classResponse.data.name);
          } else {
            setClassName(null);
            dispatch(
              setPopup({
                type: "error",
                message: "Class not found.",
              })
            );
          }
        } catch (error) {
          setClassName(null);
          dispatch(
            setPopup({
              type: "error",
              message: `Failed to fetch class information: ${error.message}`,
            })
          );
        }
      };

      fetchClassName();
    }
  }, [profile]);

  const validateField = useCallback((name, value) => {
    let error = "";
    switch (name) {
      case "phone":
        if (value.trim() === "") {
          error = "Phone is required";
        } else if (!regex.phone.pattern.test(value)) {
          error = regex.phone.message;
        }
        break;
      case "email":
        if (value.trim() === "") {
          error = "Email is required";
        } else if (!regex.email.pattern.test(value)) {
          error = regex.email.message;
        }
        break;
      case "address":
        if (value.trim() === "") {
          error = "Address is required";
        } else if (!regex.address.pattern.test(value)) {
          error = regex.address.message;
        }
        break;
      default:
        break;
    }
    return error;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    setAvatarFile(selectedFile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...initialData });
    setErrors({
      phone: "",
      email: "",
      address: "",
    });
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    const updatedData = {};

    if (formData.phone.trim() !== "") {
      updatedData.phone = formData.phone;
    }
    if (formData.email.trim() !== "") {
      updatedData.email = formData.email;
    }
    if (formData.address.trim() !== "") {
      updatedData.address = formData.address;
    }

    if (avatarFile) {
      updatedData.avatar = avatarFile;
    }

    if (
      Object.keys(updatedData).length === 0 ||
      Object.values(errors).some((error) => error)
    ) {
      dispatch(
        setPopup({
          type: "warning",
          message: "Please fix the errors before saving.",
        })
      );
      return;
    }

    try {
      const response = await updateProfileApi(updatedData);

      if (response.success) {
        setProfile(response.user);
        setIsEditing(false);
        setInitialData({
          phone: response.user.phone,
          email: response.user.email,
          address: response.user.address,
        });
        
        dispatch(
          setPopup({
            type: "success",
            message: "Profile updated successfully!",
          })
        );
      } else {
        dispatch(
          setPopup({
            type: "error",
            message:
              response.message ||
              "An error occurred while updating the profile.",
          })
        );
      }
    } catch (error) {
      dispatch(
        setPopup({
          type: "error",
          message: "An error occurred while updating the profile.",
        })
      );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ maxWidth: 1200, margin: "0 auto", padding: 3, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              mt={4}
            >
              <Avatar
                alt={profile.fullName}
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : profile.avatar
                    ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                        profile.avatar
                      }`
                    : "/default-avatar.png"
                }
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: "5px solid #1976d2",
                  boxShadow: 4,
                }}
              />
              <Box textAlign="center" mt={2}>
                <Typography variant="h5" fontWeight="bold">
                  {profile.fullName}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  fontWeight="light"
                >
                  @{profile.username}
                </Typography>
              </Box>
            </Box>

            {/* Điều kiện hiển thị nút chỉnh sửa avatar */}
            {isEditing && (
              <Box textAlign="center" mt={2}>
                <Button variant="contained" component="label">
                  Change Avatar
                  <input type="file" hidden onChange={handleAvatarChange} />
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Profile Details
            </Typography>
            <Paper
              sx={{ padding: 3, borderRadius: 2, boxShadow: 2, marginTop: 2 }}
            >
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Email</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.email}
                          helperText={errors.email}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2">{profile.email}</Typography>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Phone</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2">{profile.phone}</Typography>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Address</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="address"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.address}
                          helperText={errors.address}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2">
                          {profile.address}
                        </Typography>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Gender</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="gender"
                          value={profile.gender}
                          onChange={handleInputChange}
                          fullWidth
                          disabled
                        />
                      ) : (
                        <Typography variant="body2">
                          {profile.gender}
                        </Typography>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Date of Birth</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="dob"
                          value={formatDate(profile.dateOfBirth)}
                          onChange={handleInputChange}
                          fullWidth
                          disabled
                        />
                      ) : (
                        <Typography variant="body2">
                          {formatDate(profile.dateOfBirth)}
                        </Typography>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        <strong>Class Name</strong>
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="className"
                          value={className || ""}
                          onChange={handleInputChange}
                          fullWidth
                          disabled
                        />
                      ) : (
                        <Typography variant="body2">
                          {className}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                </Grid>

                {/* Save or Edit buttons */}
                {isEditing ? (
                  <Box
                    mt={2}
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Box
                    mt={2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
