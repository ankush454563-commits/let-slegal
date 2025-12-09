import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Applications from '../pages/Applications';
import Services from '../pages/Services';
import Users from '../pages/Users';
import Layout from '../components/Layout';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return admin ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { admin } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={admin ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="services" element={<Services />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
