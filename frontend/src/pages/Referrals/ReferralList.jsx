import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const ReferralList = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  useEffect(() => {
    api.get('/referrals/').then(res => setReferrals(res.data.results || res.data)).catch(console.error);
  }, []);
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Referrals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/referrals/create')}>Create Referral</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Member</TableCell><TableCell>Facility</TableCell><TableCell>Priority</TableCell><TableCell>Status</TableCell><TableCell>Referral Date</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{referrals.map(r => <TableRow key={r.id}><TableCell>{r.member_name}</TableCell><TableCell>{r.facility_name}</TableCell><TableCell><Chip label={r.priority} color={r.priority === 'emergency' ? 'error' : r.priority === 'urgent' ? 'warning' : 'default'} size="small" /></TableCell><TableCell><Chip label={r.status} color={r.status === 'completed' ? 'success' : r.status === 'cancelled' ? 'error' : 'default'} size="small" /></TableCell><TableCell>{new Date(r.referral_date).toLocaleDateString()}</TableCell><TableCell><IconButton onClick={() => navigate(`/referrals/${r.id}/edit`)}><EditIcon /></IconButton></TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReferralList;
