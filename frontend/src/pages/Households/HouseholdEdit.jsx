import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';
import { KENYAN_COUNTIES } from '../../utils/constants';

const HouseholdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ head_name: '', contact_phone: '', county: '', sub_county: '', ward: '', village: '', location_text: '' });

  useEffect(() => {
    api.get(`/households/${id}/`).then(res => setFormData(res.data)).catch(console.error);
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/households/${id}/`, formData);
      navigate('/households');
    } catch (error) {
      console.error('Error updating household:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Edit Household</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth label="Head Name" name="head_name" value={formData.head_name} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Contact Phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="County" name="county" value={formData.county} onChange={handleChange} required>{KENYAN_COUNTIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Sub-County" name="sub_county" value={formData.sub_county} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Ward" name="ward" value={formData.ward} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Village" name="village" value={formData.village} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Location Details" name="location_text" value={formData.location_text} onChange={handleChange} /></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Update Household</Button><Button variant="outlined" onClick={() => navigate('/households')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default HouseholdEdit;
