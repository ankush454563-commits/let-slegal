import React, { useState, useEffect } from 'react';
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
      // Fetch recent applications
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
      icon: <People sx={{ fontSize: 40, color: '#2196F3' }} />,
      color: '#E3F2FD',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: <Description sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FFF3E0',
    },
    {
      title: 'Pending',
      value: stats.pendingApplications,
      icon: <Pending sx={{ fontSize: 40, color: '#FF5722' }} />,
      color: '#FFEBEE',
    },
    {
      title: 'Completed',
      value: stats.completedApplications,
      icon: <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#E8F5E9',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 40, color: '#9C27B0' }} />,
      color: '#F3E5F5',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ bgcolor: stat.color }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Applications
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference No.</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.referenceNumber}</TableCell>
                  <TableCell>{app.user?.name}</TableCell>
                  <TableCell>{app.service?.name}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          app.status === 'success'
                            ? 'success.main'
                            : app.status === 'pending'
                            ? 'warning.main'
                            : app.status === 'failed'
                            ? 'error.main'
                            : 'info.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {app.status.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
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
