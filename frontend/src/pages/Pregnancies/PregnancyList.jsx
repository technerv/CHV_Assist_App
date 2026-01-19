import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const PregnancyList = () => {
  const navigate = useNavigate();
  const [pregnancies, setPregnancies] = useState([]);
  useEffect(() => {
    api.get('/pregnancies/').then(res => setPregnancies(res.data.results || res.data)).catch(console.error);
  }, []);
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Pregnancies</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/pregnancies/create')}>Add Pregnancy</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Member</TableCell><TableCell>LMP Date</TableCell><TableCell>EDD</TableCell><TableCell>Status</TableCell><TableCell>ANC Visits</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{pregnancies.map(p => <TableRow key={p.id}><TableCell>{p.member_name}</TableCell><TableCell>{p.lmp_date}</TableCell><TableCell>{p.edd}</TableCell><TableCell>{p.status}</TableCell><TableCell>{p.anc_visits}</TableCell><TableCell><IconButton onClick={() => navigate(`/pregnancies/${p.id}/edit`)}><EditIcon /></IconButton></TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PregnancyList;
