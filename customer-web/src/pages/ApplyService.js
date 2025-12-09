import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

function ApplyService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadService();
  }, [id, user]);

  const loadService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data.service);
    } catch (error) {
      console.error('Error loading service:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/applications', {
        serviceId: id,
        formData
      });
      navigate(`/application/${res.data.application._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Apply for {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Fill in the required information to proceed with your application
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            value={user?.name || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Email"
            value={user?.email || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Phone"
            value={user?.phone || ''}
            margin="normal"
            disabled
          />
          
          <TextField
            fullWidth
            label="Additional Details"
            multiline
            rows={4}
            value={formData.details || ''}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            margin="normal"
            placeholder="Please provide any additional information relevant to this service"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Service Fee: ₹{service.price}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default ApplyService;
