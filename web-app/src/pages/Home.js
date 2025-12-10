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
  Chip,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { 
  Gavel, 
  Business, 
  Description, 
  Copyright, 
  AdminPanelSettings 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
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
  const { user, logout } = useAuth();

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

  const formatPrice = (price) => {
    if (price === 0) return 'Custom Pricing';
    return `₹${price.toLocaleString()}`;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Let'sLegal
          </Typography>
          
          {/* Admin Portal Button */}
          <Button 
            color="inherit" 
            startIcon={<AdminPanelSettings />}
            onClick={() => navigate('/admin')}
            sx={{ mr: 2 }}
          >
            Admin Portal
          </Button>

          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/my-applications')}>
                My Applications
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom color="primary">
            Welcome to Let'sLegal
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your trusted partner for law and business services
          </Typography>
        </Box>

        {loading ? (
          <Typography>Loading services...</Typography>
        ) : (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: 'primary.main', mr: 1 }}>
                        {iconMap[service.category] || <Description />}
                      </Box>
                      <Typography variant="h6" component="div">
                        {service.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    
                    <Chip 
                      label={service.category} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      {formatPrice(service.price)}
                    </Typography>
                    
                    {service.processingTime && (
                      <Typography variant="caption" color="text.secondary">
                        Processing: {service.processingTime}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/service/${service._id}`)}
                    >
                      Learn More
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
        )}
      </Container>
    </>
  );
}

export default Home;
