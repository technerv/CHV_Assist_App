import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const VisitList = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  useEffect(() => {
    api.get('/visits/').then(res => setVisits(res.data.results || res.data)).catch(console.error);
  }, []);
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>CHV Visits</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/visits/create')}>Record Visit</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>CHV</TableCell><TableCell>Household</TableCell><TableCell>Visit Date</TableCell><TableCell>Purpose</TableCell><TableCell>Channel</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{visits.map(v => <TableRow key={v.id}><TableCell>{v.chv_name}</TableCell><TableCell>{v.household_head_name}</TableCell><TableCell>{new Date(v.visit_date).toLocaleDateString()}</TableCell><TableCell>{v.purpose}</TableCell><TableCell>{v.channel}</TableCell><TableCell><IconButton onClick={() => navigate(`/visits/${v.id}/edit`)}><EditIcon /></IconButton></TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default VisitList;
