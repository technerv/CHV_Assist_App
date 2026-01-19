import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';

const MemberCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', sex: '', date_of_birth: '', national_id: '', nhif_number: '', phone: '', household: '' });
  const [households, setHouseholds] = useState([]);
  useEffect(() => {
    api.get('/households/').then(res => setHouseholds(res.data.results || res.data)).catch(console.error);
  }, []);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/members/', formData);
      navigate('/members');
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Add New Member</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Sex" name="sex" value={formData.sex} onChange={handleChange} required><MenuItem value="M">Male</MenuItem><MenuItem value="F">Female</MenuItem></TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="National ID" name="national_id" value={formData.national_id} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="NHIF Number" name="nhif_number" value={formData.nhif_number} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth select label="Household" name="household" value={formData.household} onChange={handleChange} required>{households.map(h => <MenuItem key={h.id} value={h.id}>{h.head_name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Create Member</Button><Button variant="outlined" onClick={() => navigate('/members')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default MemberCreate;
