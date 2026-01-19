import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';

const ReferralEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ member: '', facility: '', chv: '', reason: '', priority: 'routine', status: 'pending' });
  const [members, setMembers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [chvs, setChvs] = useState([]);
  useEffect(() => {
    api.get(`/referrals/${id}/`).then(res => setFormData(res.data)).catch(console.error);
    api.get('/members/').then(res => setMembers(res.data.results || res.data)).catch(console.error);
    api.get('/facilities/').then(res => setFacilities(res.data.results || res.data)).catch(console.error);
    api.get('/chvs/').then(res => setChvs(res.data.results || res.data)).catch(console.error);
  }, [id]);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/referrals/${id}/`, formData);
      navigate('/referrals');
    } catch (error) {
      console.error('Error updating referral:', error);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Edit Referral</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}><TextField fullWidth select label="Member" name="member" value={formData.member} onChange={handleChange} required>{members.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth select label="Facility" name="facility" value={formData.facility} onChange={handleChange} required>{facilities.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth select label="CHV (Optional)" name="chv" value={formData.chv || ''} onChange={handleChange}><MenuItem value="">None</MenuItem>{chvs.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Reason" name="reason" value={formData.reason} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Priority" name="priority" value={formData.priority} onChange={handleChange} required><MenuItem value="routine">Routine</MenuItem><MenuItem value="urgent">Urgent</MenuItem><MenuItem value="emergency">Emergency</MenuItem></TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange} required><MenuItem value="pending">Pending</MenuItem><MenuItem value="completed">Completed</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem></TextField></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Update Referral</Button><Button variant="outlined" onClick={() => navigate('/referrals')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ReferralEdit;
