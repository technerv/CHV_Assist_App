import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const HouseholdList = () => {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      const response = await api.get('/households/');
      setHouseholds(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Households
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/households/create')}>
          Add Household
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Head Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>County</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Village</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {households.map((household) => (
              <TableRow key={household.id}>
                <TableCell>{household.head_name}</TableCell>
                <TableCell>{household.contact_phone}</TableCell>
                <TableCell>{household.county}</TableCell>
                <TableCell>{household.ward}</TableCell>
                <TableCell>{household.village}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/households/${household.id}/edit`)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HouseholdList;
