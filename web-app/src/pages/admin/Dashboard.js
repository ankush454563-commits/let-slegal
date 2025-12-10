import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  People,
  Description,
  CheckCircle,
  Pending,
  AttachMoney,
} from '@mui/icons-material';
import api from '../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalRevenue: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
      
      const appsResponse = await api.get('/admin/applications?limit=5');
      setRecentApplications(appsResponse.data.applications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <People fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: <Description fontSize="large" />,
      color: '#9c27b0',
    },
    {
      title: 'Pending',
      value: stats.pendingApplications,
      icon: <Pending fontSize="large" />,
      color: '#ff9800',
    },
    {
      title: 'Completed',
      value: stats.completedApplications,
      icon: <CheckCircle fontSize="large" />,
      color: '#4caf50',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />,
      color: '#f44336',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      under_review: 'info',
      approved: 'success',
      rejected: 'error',
      completed: 'success'
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Applications
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.applicationNumber}</TableCell>
                  <TableCell>{app.user?.name || 'N/A'}</TableCell>
                  <TableCell>{app.service?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(app.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₹{app.amount?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
