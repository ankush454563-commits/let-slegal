import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../config/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    estimatedDuration: '',
    features: [],
    requiredDocuments: [],
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/admin/services/${currentService._id}`, currentService);
      } else {
        await api.post('/admin/services', currentService);
      }
      setOpenDialog(false);
      fetchServices();
      resetForm();
      alert(`Service ${editMode ? 'updated' : 'created'} successfully`);
    } catch (error) {
      alert('Error saving service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${id}`);
        fetchServices();
        alert('Service deleted successfully');
      } catch (error) {
        alert('Error deleting service');
      }
    }
  };

  const resetForm = () => {
    setCurrentService({
      name: '',
      description: '',
      category: '',
      price: '',
      estimatedDuration: '',
      features: [],
      requiredDocuments: [],
      isActive: true,
    });
    setEditMode(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setEditMode(true);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Add Service
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>₹{service.price}</TableCell>
                    <TableCell>{service.estimatedDuration}</TableCell>
                    <TableCell>
                      <Chip
                        label={service.isActive ? 'Active' : 'Inactive'}
                        color={service.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(service)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(service._id)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={services.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Name"
            value={currentService.name}
            onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={currentService.description}
            onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            value={currentService.category}
            onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Price"
              type="number"
              value={currentService.price}
              onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
              fullWidth
            />
            <TextField
              label="Estimated Duration"
              value={currentService.estimatedDuration}
              onChange={(e) =>
                setCurrentService({ ...currentService, estimatedDuration: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesPage;
