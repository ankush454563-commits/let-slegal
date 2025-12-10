import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../../config/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    processingTime: '',
    requirements: '',
    active: true
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage({ type: 'error', text: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditMode(true);
      setCurrentService({
        ...service,
        requirements: service.requirements?.join('\n') || ''
      });
    } else {
      setEditMode(false);
      setCurrentService({
        name: '',
        description: '',
        category: '',
        price: '',
        processingTime: '',
        requirements: '',
        active: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentService({
      name: '',
      description: '',
      category: '',
      price: '',
      processingTime: '',
      requirements: '',
      active: true
    });
  };

  const handleSaveService = async () => {
    try {
      const serviceData = {
        ...currentService,
        requirements: currentService.requirements
          .split('\n')
          .filter(req => req.trim())
      };

      if (editMode) {
        await api.put(`/admin/services/${currentService._id}`, serviceData);
        setMessage({ type: 'success', text: 'Service updated successfully' });
      } else {
        await api.post('/admin/services', serviceData);
        setMessage({ type: 'success', text: 'Service created successfully' });
      }

      fetchServices();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage({ type: 'error', text: 'Failed to save service' });
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${id}`);
        setMessage({ type: 'success', text: 'Service deleted successfully' });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setMessage({ type: 'error', text: 'Failed to delete service' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentService({
      ...currentService,
      [name]: name === 'active' ? checked : value
    });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Services</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Service
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>₹{service.price?.toLocaleString()}</TableCell>
                  <TableCell>{service.processingTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={service.active ? 'Active' : 'Inactive'}
                      color={service.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                name="name"
                value={currentService.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={currentService.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={currentService.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                value={currentService.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Processing Time"
                name="processingTime"
                value={currentService.processingTime}
                onChange={handleChange}
                placeholder="e.g., 7-10 days"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    checked={currentService.active}
                    onChange={handleChange}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements (one per line)"
                name="requirements"
                multiline
                rows={4}
                value={currentService.requirements}
                onChange={handleChange}
                placeholder="PAN Card&#10;Aadhaar Card&#10;Address Proof"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveService} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
