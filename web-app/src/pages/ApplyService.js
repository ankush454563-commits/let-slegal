import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

function ApplyService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    additionalInfo: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadService();
  }, [id, user, navigate]);

  const loadService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data.service);
    } catch (error) {
      console.error('Error loading service:', error);
      setError('Failed to load service details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/applications', {
        serviceId: id,
        ...formData
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-applications');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Application submitted successfully! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Service Details
              </Typography>
              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>
              <Typography variant="h6" color="primary">
                Price: ₹{service.price.toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Information"
                name="additionalInfo"
                multiline
                rows={4}
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any specific requirements or questions?"
              />
            </Grid>

            {service.requirements && service.requirements.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Required Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please ensure you have the following documents ready:
                </Typography>
                <ul>
                  {service.requirements.map((req, index) => (
                    <li key={index}>
                      <Typography variant="body2">{req}</Typography>
                    </li>
                  ))}
                </ul>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || success}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default ApplyService;
