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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const CHVList = () => {
  const navigate = useNavigate();
  const [chvs, setChvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCHVs();
  }, []);

  const fetchCHVs = async () => {
    try {
      const response = await api.get('/chvs/');
      setChvs(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching CHVs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Community Health Volunteers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/chvs/create')}
        >
          Add CHV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>County</TableCell>
              <TableCell>Sub-County</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chvs.map((chv) => (
              <TableRow key={chv.id}>
                <TableCell>{chv.name}</TableCell>
                <TableCell>{chv.phone}</TableCell>
                <TableCell>{chv.county}</TableCell>
                <TableCell>{chv.sub_county}</TableCell>
                <TableCell>{chv.ward}</TableCell>
                <TableCell>
                  <Chip
                    label={chv.is_active ? 'Active' : 'Inactive'}
                    color={chv.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/chvs/${chv.id}/edit`)}>
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

export default CHVList;
