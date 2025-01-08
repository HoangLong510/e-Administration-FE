import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { createDocumentApi } from './service';
import { Link } from 'react-router-dom';

export default function AddDocument() {
  const [formData, setFormData] = useState({
    name: '',
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file: file }));
    if (touched.file) {
      setErrors((prev) => ({ ...prev, file: file ? '' : 'File is required' }));
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
    data.append('name', formData.name);
    if (formData.file) {
      data.append('file', formData.file);
    }

    console.log([...data]);

    try {
      // const response = await createDocumentApi(data);
      const response = { success: true }; // Mocked response for testing
      if (response.success) {
        alert('Document added successfully!');
      } else {
        console.error('Error response:', response);
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error response:', error.response);
      alert('An error occurred while adding the document.');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3, bgcolor: '#fff', borderRadius: '10px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Add Document
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Document management
          </Typography>
        </Box>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2, textTransform: 'none' }}
          component={Link}
          to="/management/document"
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

        <Box>
          <InputLabel id="file-upload-label">File Upload</InputLabel>
          <TextField
            fullWidth
            name="file"
            type="file"
            variant="outlined"
            required
            inputProps={{ accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document' }}
            onChange={handleFileChange}
            onBlur={handleBlur}
            error={touched.file && !!errors.file}
            helperText={touched.file && errors.file}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
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
            Add Document
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
