import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

function MyApplications() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        My Applications
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference No.</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.referenceNumber}</TableCell>
                <TableCell>{app.service?.name}</TableCell>
                <TableCell>
                  {new Date(app.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={app.status.replace('_', ' ')} 
                    color={getStatusColor(app.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>₹{app.service?.price}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/application/${app._id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {applications.length === 0 && !loading && (
        <Typography textAlign="center" sx={{ mt: 4 }} color="text.secondary">
          No applications yet. Start by applying for a service!
        </Typography>
      )}
    </Container>
  );
}

export default MyApplications;
