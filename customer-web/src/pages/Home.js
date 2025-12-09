import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { Gavel, Business, Description, Copyright } from '@mui/icons-material';
import api from '../config/api';

const iconMap = {
  'Legal Consultation': <Gavel />,
  'Company Registration': <Business />,
  'GST Services': <Description />,
  'Trademark & IPR': <Copyright />
};

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.services);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary">
          Welcome to Let'sLegal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your trusted partner for legal and business services
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {iconMap[service.category] || <Gavel />}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {service.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Chip 
                  label={service.category} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" color="primary">
                  ₹{service.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Processing: {service.processingTime || '7-10 days'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/service/${service._id}`)}
                >
                  View Details
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => navigate(`/apply/${service._id}`)}
                >
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {services.length === 0 && !loading && (
        <Typography textAlign="center" color="text.secondary">
          No services available at the moment
        </Typography>
      )}
    </Container>
  );
}

export default Home;
