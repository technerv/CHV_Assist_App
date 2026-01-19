import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  useEffect(() => {
    api.get('/members/').then(res => setMembers(res.data.results || res.data)).catch(console.error);
  }, []);
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Community Members</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/members/create')}>Add Member</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Sex</TableCell><TableCell>Date of Birth</TableCell><TableCell>Household</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{members.map(m => <TableRow key={m.id}><TableCell>{m.name}</TableCell><TableCell>{m.sex}</TableCell><TableCell>{m.date_of_birth}</TableCell><TableCell>{m.household_head_name}</TableCell><TableCell><IconButton onClick={() => navigate(`/members/${m.id}/edit`)}><EditIcon /></IconButton></TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MemberList;
