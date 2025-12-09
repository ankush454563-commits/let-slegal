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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Visibility, AddCircle } from '@mui/icons-material';
import api from '../config/api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formFields, setFormFields] = useState([{ label: '', type: 'text', required: true }]);

  useEffect(() => {
    fetchApplications();
  }, [page, rowsPerPage]);

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/admin/applications?page=${page + 1}&limit=${rowsPerPage}`);
      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/admin/applications/${selectedApp._id}/status`, {
        status,
        adminNotes,
      });
      setOpenDialog(false);
      fetchApplications();
      alert('Status updated successfully');
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleCreateForm = async () => {
    try {
      await api.post('/admin/create-form', {
        applicationId: selectedApp._id,
        title: formTitle,
        fields: formFields,
      });
      setOpenFormDialog(false);
      fetchApplications();
      alert('Form created and sent to user');
    } catch (error) {
      alert('Error creating form');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Applications
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference No.</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.referenceNumber}</TableCell>
                  <TableCell>
                    {app.user?.name}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {app.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{app.service?.name}</TableCell>
                  <TableCell>
                    <Chip label={app.status.toUpperCase()} color={getStatusColor(app.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.paymentStatus}
                      color={app.paymentStatus === 'completed' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedApp(app);
                          setStatus(app.status);
                          setAdminNotes(app.adminNotes || '');
                          setOpenDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Request Form">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedApp(app);
                          setOpenFormDialog(true);
                        }}
                      >
                        <AddCircle />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalPages * rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Admin Notes"
            multiline
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
          {selectedApp && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Application Details:</Typography>
              <Typography variant="body2">Reference: {selectedApp.referenceNumber}</Typography>
              <Typography variant="body2">User: {selectedApp.user?.name}</Typography>
              <Typography variant="body2">Service: {selectedApp.service?.name}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Form Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Additional Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Typography variant="subtitle2" gutterBottom>
            Form Fields:
          </Typography>
          {formFields.map((field, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Field Label"
                value={field.label}
                onChange={(e) => {
                  const newFields = [...formFields];
                  newFields[index].label = e.target.value;
                  setFormFields(newFields);
                }}
                fullWidth
              />
              <Select
                value={field.type}
                onChange={(e) => {
                  const newFields = [...formFields];
                  newFields[index].type = e.target.value;
                  setFormFields(newFields);
                }}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
              </Select>
            </Box>
          ))}
          <Button
            onClick={() =>
              setFormFields([...formFields, { label: '', type: 'text', required: true }])
            }
          >
            Add Field
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateForm} variant="contained">
            Create Form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationsPage;
