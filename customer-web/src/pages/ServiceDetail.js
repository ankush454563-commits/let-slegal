import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            {service.name}
          </Typography>
          <Chip label={service.category} color="primary" />
        </Box>

        <Typography variant="body1" paragraph>
          {service.description}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" gutterBottom>
            ₹{service.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Processing Time: {service.processingTime || '7-10 business days'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {service.features && service.features.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <List>
              {service.features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${feature}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {service.requiredDocuments && service.requiredDocuments.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <List>
              {service.requiredDocuments.map((doc, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${doc}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate(`/apply/${service._id}`)}
        >
          Apply for this Service
        </Button>
      </Paper>
    </Container>
  );
}

export default ServiceDetail;
