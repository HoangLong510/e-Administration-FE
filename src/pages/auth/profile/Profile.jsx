import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileApi, updateProfileApi } from "./service";
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
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileApi();
        setLoading(false);

        if (response.success) {
          setProfile(response.user);
          setFormData({
            phone: response.user.phone,
            email: response.user.email,
            address: response.user.address,
          });
        } else {
          dispatch(
            setPopup({
              type: "error",
              message: response.message || "An error occurred while fetching the profile.",
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
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  
    if (Object.keys(updatedData).length === 0) {
      dispatch(
        setPopup({
          type: "warning",
          message: "Please fill in at least one field to update the profile.",
        })
      );
      return;
    }
  
    const response = await updateProfileApi(updatedData);
  
    if (response.success) {
      setProfile(response.user);
      setIsEditing(false);
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
          message: response.message || "An error occurred while updating the profile.",
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
            <Box display="flex" justifyContent="center">
              <Avatar
                alt={profile.fullName}
                src={profile.avatar || "/images/logo/Avatar-Linh.jpg"}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  border: "5px solid #1976d2",
                  boxShadow: 4,
                }}
              />
            </Box>
            <Box textAlign="center" mt={2}>
              <Typography variant="h5" fontWeight="bold">
                {profile.fullName}
              </Typography>
              <Typography variant="body1" color="textSecondary" fontWeight="light">
                @{profile.username}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Profile Details
            </Typography>
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 2, marginTop: 2 }}>
              <Box>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Email:</strong>
                  {isEditing ? (
                    <TextField
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    profile.email
                  )}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Phone:</strong>
                  {isEditing ? (
                    <TextField
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    profile.phone
                  )}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Address:</strong>
                  {isEditing ? (
                    <TextField
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    profile.address
                  )}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Gender:</strong>
                  {isEditing ? (
                    <TextField
                      name="gender"
                      value={formData.gender || profile.gender}
                      onChange={handleInputChange}
                      fullWidth
                      disabled
                    />
                  ) : (
                    profile.gender
                  )}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <strong>Date of Birth:</strong>
                  {isEditing ? (
                    <TextField
                      name="dob"
                      value={formData.dateOfBirth || profile.dateOfBirth}
                      onChange={handleInputChange}
                      fullWidth
                      disabled
                    />
                  ) : (
                    profile.dateOfBirth
                  )}
                </Typography>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ marginRight: 2 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
