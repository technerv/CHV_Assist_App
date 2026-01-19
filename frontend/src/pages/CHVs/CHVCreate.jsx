import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';
import api from '../../services/api';
import { KENYAN_COUNTIES } from '../../utils/constants';

const CHVCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    mpesa_number: '',
    email: '',
    county: '',
    sub_county: '',
    ward: '',
    service_area: '',
    is_active: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chvs/', formData);
      navigate('/chvs');
    } catch (error) {
      console.error('Error creating CHV:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add New CHV
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="M-Pesa Number"
                name="mpesa_number"
                value={formData.mpesa_number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="County"
                name="county"
                value={formData.county}
                onChange={handleChange}
                required
              >
                {KENYAN_COUNTIES.map((county) => (
                  <MenuItem key={county} value={county}>
                    {county}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub-County"
                name="sub_county"
                value={formData.sub_county}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ward"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Area"
                name="service_area"
                value={formData.service_area}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button type="submit" variant="contained">
                  Create CHV
                </Button>
                <Button variant="outlined" onClick={() => navigate('/chvs')}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CHVCreate;
