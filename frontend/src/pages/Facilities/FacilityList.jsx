import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const FacilityList = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  useEffect(() => {
    api.get('/facilities/').then(res => setFacilities(res.data.results || res.data)).catch(console.error);
  }, []);
  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Healthcare Facilities</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/facilities/create')}>Add Facility</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>County</TableCell><TableCell>Sub-County</TableCell><TableCell>Phone</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>{facilities.map(f => <TableRow key={f.id}><TableCell>{f.name}</TableCell><TableCell>{f.facility_type}</TableCell><TableCell>{f.county}</TableCell><TableCell>{f.sub_county}</TableCell><TableCell>{f.phone}</TableCell><TableCell><IconButton onClick={() => navigate(`/facilities/${f.id}/edit`)}><EditIcon /></IconButton></TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FacilityList;
