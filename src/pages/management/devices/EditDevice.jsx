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
import { createDeviceApi, updateDeviceApi } from './service';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function EditDevice() {
  const { id } = useParams();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    status: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/management/Device/get-device/${id}`);
      if (res.data.success) {
        const device = res.data.device;
        setFormData({
          name: device.name,
          type: device.type,
          description: device.description,
          status: device.status ? 'active' : 'Disable',
          image: device.image,
        });
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (touched.image) {
      setErrors((prev) => ({ ...prev, image: file ? '' : 'Image is required' }));
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
  
    const data = new FormData();
    data.append('Name', formData.name);
    data.append('Type', formData.type);
    data.append('Description', formData.description);
    data.append('Status', formData.status === 'active'); 
    if (formData.image) {
      data.append('ImageFile', formData.image);
    }
    
    try {
      const response = await updateDeviceApi(id, data);
      if (response.success) {
        alert('Device updated successfully!');
        history.push('/management/devices');
      } else {
        console.error('Error response:', response); // Log chi tiết lỗi
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error response:', error.response); // Log chi tiết lỗi
      alert('An error occurred while updating the device.');
    }
  };
  
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3, bgcolor: '#fff', borderRadius: '10px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Edit Device
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Device management
          </Typography>
        </Box>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2, textTransform: 'none' }}
          component={Link}
          to="/management/devices"
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
          name="type"
          label="Type"
          variant="outlined"
          required
          value={formData.type}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={touched.type && !!errors.type}
          helperText={touched.type && errors.type}
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

        <Box>
          <InputLabel id="image-label">Upload Image</InputLabel>
          <TextField
            name="image"
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleImageChange}
            onBlur={handleBlur}
            error={touched.image && !!errors.image}
            helperText={touched.image && errors.image}
            sx={{ mt: 1 }}
          />
        </Box>

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
            Edit Device
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
