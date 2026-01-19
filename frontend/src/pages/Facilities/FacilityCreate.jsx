import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';
import { KENYAN_COUNTIES, FACILITY_TYPES } from '../../utils/constants';

const FacilityCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', facility_type: '', county: '', sub_county: '', ward: '', address: '', phone: '', is_active: true });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/facilities/', formData);
      navigate('/facilities');
    } catch (error) {
      console.error('Error creating facility:', error);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Add New Facility</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth label="Facility Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Facility Type" name="facility_type" value={formData.facility_type} onChange={handleChange} required>{FACILITY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="County" name="county" value={formData.county} onChange={handleChange} required>{KENYAN_COUNTIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Sub-County" name="sub_county" value={formData.sub_county} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Ward" name="ward" value={formData.ward} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Address" name="address" value={formData.address} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Create Facility</Button><Button variant="outlined" onClick={() => navigate('/facilities')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FacilityCreate;
