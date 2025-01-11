import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createSoftwareApi, updateSoftwareApi, getSoftwareByIdApi } from './service';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';

export default function AddSoftware() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    licenseExpire: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const res = await getSoftwareByIdApi(id);
        if (res.success) {
          const software = res.software;
          setFormData({
            name: software.name,
            description: software.description,
            licenseExpire: new Date(software.licenseExpire).toISOString().split('T')[0],  // Convert to YYYY-MM-DD format
            status: software.status ? 'active' : 'Disable',
          });
        }
      };
      fetchData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'licenseExpire') {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      if (selectedDate <= currentDate.setDate(currentDate.getDate() + 7)) {
        error = 'License Expire date must be at least 7 days from today';
      }
    }
    if (value.trim() === '') {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return error;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      validationErrors[key] = validateField(key, formData[key]);
    });

    if (Object.keys(validationErrors).some(key => validationErrors[key])) {
      setErrors(validationErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    const data = {
      name: formData.name,
      description: formData.description,
      licenseExpire: formData.licenseExpire,
      status: formData.status === 'active',
    };

    dispatch(setLoading());
    try {
      let response;
      if (id) {
        response = await updateSoftwareApi(id, data);
      } else {
        response = await createSoftwareApi(data);
      }
      dispatch(clearLoading());
      if (response.success) {
        dispatch(setPopup({ type: 'success', message: id ? 'Software updated successfully!' : 'Software added successfully!' }));
        if (!id) {
          setFormData({
            name: '',
            description: '',
            licenseExpire: '',
            status: '',
          });
          setErrors({});
          setTouched({});
        } else {
          navigate('/management/software');
        }
      } else {
        if (response.errors) {
          setErrors(response.errors);
          setTouched(Object.keys(response.errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        }
        dispatch(setPopup({ type: 'error', message: response.message }));
      }
    } catch (error) {
      console.error('Error response:', error.response);
      dispatch(clearLoading());
      dispatch(setPopup({ type: 'error', message: id ? 'An error occurred while updating the software.' : 'An error occurred while adding the software.' }));
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3, bgcolor: '#fff', borderRadius: '10px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            {id ? 'Edit Software' : 'Add Software'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Software management
          </Typography>
        </Box>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2, textTransform: 'none' }}
          component={Link}
          to="/management/software"
        >
          Back to list
        </Button>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          name="name"
          label="Name"
          variant="outlined"
          required
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={touched.name && !!errors.name}
          helperText={touched.name && errors.name}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
        />

        <TextField
          fullWidth
          name="description"
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          required
          value={formData.description}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={touched.description && !!errors.description}
          helperText={touched.description && errors.description}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
        />

        <TextField
          fullWidth
          name="licenseExpire"
          label="License Expire"
          type="date"
          variant="outlined"
          required
          value={formData.licenseExpire}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={touched.licenseExpire && !!errors.licenseExpire}
          helperText={touched.licenseExpire && errors.licenseExpire}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <FormControl fullWidth required error={touched.status && !!errors.status}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            onBlur={handleBlur}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="Disable">Disable</MenuItem>
          </Select>
          <FormHelperText>{touched.status && errors.status}</FormHelperText>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
              textTransform: 'none',
              borderRadius: 1,
              px: 4,
            }}
          >
            {id ? 'Edit Software' : 'Add Software'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
