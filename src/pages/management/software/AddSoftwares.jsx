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
import { Link, useParams } from 'react-router-dom';

export default function AddSoftware() {
  const { id } = useParams();

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
      setErrors((prev) => ({ ...prev, [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: typeof formData[name] === 'string' && formData[name].trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '',
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] || (typeof formData[key] === 'string' && formData[key].trim() === '')) {
        validationErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
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

    console.log(data);

    try {
      let response;
      if (id) {
        response = await updateSoftwareApi(id, data);
      } else {
        response = await createSoftwareApi(data);
      }
      if (response.success) {
        alert(id ? 'Software updated successfully!' : 'Software added successfully!');
      } else {
        console.error('Error response:', response);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error response:', error.response);
      alert(id ? 'An error occurred while updating the software.' : 'An error occurred while adding the software.');
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
