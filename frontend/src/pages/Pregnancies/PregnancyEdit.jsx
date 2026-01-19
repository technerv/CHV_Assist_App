import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';

const PregnancyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ member: '', lmp_date: '', edd: '', status: 'active', anc_visits: 0 });
  const [members, setMembers] = useState([]);
  useEffect(() => {
    api.get(`/pregnancies/${id}/`).then(res => setFormData(res.data)).catch(console.error);
    api.get('/members/').then(res => setMembers(res.data.results || res.data)).catch(console.error);
  }, [id]);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/pregnancies/${id}/`, formData);
      navigate('/pregnancies');
    } catch (error) {
      console.error('Error updating pregnancy:', error);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Edit Pregnancy</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth select label="Member" name="member" value={formData.member} onChange={handleChange} required>{members.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="LMP Date" name="lmp_date" value={formData.lmp_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Expected Due Date (EDD)" name="edd" value={formData.edd} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange} required><MenuItem value="active">Active</MenuItem><MenuItem value="delivered">Delivered</MenuItem><MenuItem value="terminated">Terminated</MenuItem><MenuItem value="lost_to_followup">Lost to Follow-up</MenuItem></TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="ANC Visits" name="anc_visits" value={formData.anc_visits} onChange={handleChange} /></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Update Pregnancy</Button><Button variant="outlined" onClick={() => navigate('/pregnancies')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PregnancyEdit;
