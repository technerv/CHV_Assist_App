import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import api from '../../services/api';

const VisitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ chv: '', household: '', member: '', visit_date: '', channel: 'app', purpose: '', observations: '', follow_up_required: false });
  const [chvs, setChvs] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    api.get(`/visits/${id}/`).then(res => setFormData({ ...res.data, visit_date: res.data.visit_date ? new Date(res.data.visit_date).toISOString().slice(0, 16) : '' })).catch(console.error);
    api.get('/chvs/').then(res => setChvs(res.data.results || res.data)).catch(console.error);
    api.get('/households/').then(res => setHouseholds(res.data.results || res.data)).catch(console.error);
    api.get('/members/').then(res => setMembers(res.data.results || res.data)).catch(console.error);
  }, [id]);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/visits/${id}/`, formData);
      navigate('/visits');
    } catch (error) {
      console.error('Error updating visit:', error);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Edit Visit</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="CHV" name="chv" value={formData.chv} onChange={handleChange} required>{chvs.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Household" name="household" value={formData.household} onChange={handleChange} required>{households.map(h => <MenuItem key={h.id} value={h.id}>{h.head_name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><TextField fullWidth select label="Member (Optional)" name="member" value={formData.member || ''} onChange={handleChange}><MenuItem value="">None</MenuItem>{members.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth type="datetime-local" label="Visit Date" name="visit_date" value={formData.visit_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Channel" name="channel" value={formData.channel} onChange={handleChange} required><MenuItem value="app">Mobile App</MenuItem><MenuItem value="ussd">USSD</MenuItem><MenuItem value="whatsapp">WhatsApp</MenuItem><MenuItem value="sms">SMS</MenuItem><MenuItem value="voice">Voice Call</MenuItem></TextField></Grid>
            <Grid item xs={12}><TextField fullWidth label="Purpose" name="purpose" value={formData.purpose} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Observations" name="observations" value={formData.observations} onChange={handleChange} /></Grid>
            <Grid item xs={12}><Box display="flex" gap={2}><Button type="submit" variant="contained">Update Visit</Button><Button variant="outlined" onClick={() => navigate('/visits')}>Cancel</Button></Box></Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default VisitEdit;
