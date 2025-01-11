import React, { useEffect, useRef, useState } from 'react';
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
import { createDeviceApi, updateDeviceApi, getDeviceByIdApi } from './service';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPopup } from '~/libs/features/popup/popupSlice';
import { clearLoading, setLoading } from '~/libs/features/loading/loadingSlice';

export default function AddDevices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

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
    if (id) {
      const fetchData = async () => {
        const res = await getDeviceByIdApi(id);
        if (res.success) {
          const device = res.device;
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
    }
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
    const validImageTypes = [ 'image/jpeg', 'image/png'];

    if (file && !validImageTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Invalid image format. JPEG, and PNG are allowed.' }));
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: file ? '' : 'Image is required' }));
    }

    setTouched((prev) => ({ ...prev, image: true }));
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
    if (formData.image && formData.image instanceof File) {
      data.append('ImageFile', formData.image);
    } else if (formData.image) {
      data.append('Image', formData.image);
    }

    dispatch(setLoading());
    try {
      let response;
      if (id) {
        response = await updateDeviceApi(id, data);
      } else {
        response = await createDeviceApi(data);
      }
      dispatch(clearLoading());
      if (response.success) {
        dispatch(setPopup({ type: 'success', message: id ? 'Device updated successfully!' : 'Device added successfully!' }));
        if (id) {
          navigate('/management/devices');
        } else {
          setFormData({
            name: '',
            type: '',
            description: '',
            status: '',
            image: null,
          });
          setErrors({});
          setTouched({});
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
          }
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
      dispatch(setPopup({ type: 'error', message: id ? 'An error occurred while updating the device.' : 'An error occurred while adding the device.' }));
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3, bgcolor: '#fff', borderRadius: '10px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            {id ? 'Edit Device' : 'Add Device'}
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

            inputRef={fileInputRef}
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
            {id ? 'Edit Device' : 'Add Device'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
