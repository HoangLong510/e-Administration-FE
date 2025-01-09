import React, { useState, useCallback } from 'react';
import { TextField, Button, Grid, Typography, Box, Paper, Alert } from '@mui/material';
import { changePasswordApi } from './service';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import regex from "~/utils/regex";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const clearFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const validateField = useCallback((name, value) => {
    let error = "";

    if (value.trim() === "") {
      error = `${name} is required`;
    } else if (name === "newPassword" && !regex.password.pattern.test(value)) {
      error = regex.password.message;
    }

    if (name === "confirmPassword" && value !== newPassword) {
      error = "Passwords do not match";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    return error;
  }, [newPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      dispatch(setPopup({
        type: "error",
        message: 'New password and confirmation password do not match.',
      }));
      return;
    }

    try {
      const response = await changePasswordApi(oldPassword, newPassword, confirmPassword);

      if (response.success) {
        dispatch(setPopup({
          type: "success",
          message: response.message || 'Password changed successfully!',
        }));

        clearFields();
      } else {
        dispatch(setPopup({
          type: "error",
          message: response.message || 'Failed to change password. Please try again.',
        }));
      }
    } catch (error) {
      dispatch(setPopup({
        type: "error",
        message: 'An error occurred while changing password. Please try again later.',
      }));
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', backgroundColor: '#f4f6f8' }}>
      <Paper sx={{ padding: 6, width: 500, borderRadius: 5, boxShadow: 10 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Change Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Old Password"
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="medium"
                sx={{ fontSize: '1.1rem' }}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="medium"
                sx={{ fontSize: '1.1rem' }}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="medium"
                sx={{ fontSize: '1.1rem' }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" type="submit">
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
