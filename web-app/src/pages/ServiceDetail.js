import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import api from '../config/api';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data.service);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!service) return <Typography>Service not found</Typography>;

  const formatPrice = (price) => {
    if (price === 0) return 'Custom Pricing';
    return `₹${price.toLocaleString()}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Services
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">
          {service.name}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Chip label={service.category} color="primary" sx={{ mr: 1 }} />
          {service.active && <Chip label="Available" color="success" />}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {service.description}
            </Typography>
          </Grid>

          {service.requirements && service.requirements.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Required Documents
              </Typography>
              <ul>
                {service.requirements.map((req, index) => (
                  <li key={index}>
                    <Typography variant="body1">{req}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Pricing
            </Typography>
            <Typography variant="h4" color="primary">
              {formatPrice(service.price)}
            </Typography>
          </Grid>

          {service.processingTime && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Processing Time
              </Typography>
              <Typography variant="h5">
                {service.processingTime}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/apply/${service._id}`)}
          >
            Apply for this Service
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ServiceDetail;
