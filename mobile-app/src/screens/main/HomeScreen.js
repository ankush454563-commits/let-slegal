import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services?isActive=true');
      setServices(response.data.services.slice(0, 6));
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Legal Consultation', icon: 'gavel' },
    { name: 'Company Registration', icon: 'office-building' },
    { name: 'GST Services', icon: 'file-document' },
    { name: 'Trademark & IPR', icon: 'trademark' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchServices} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>How can we help you today?</Text>
      </View>

      <Card style={styles.trackCard}>
        <Card.Content>
          <View style={styles.trackContent}>
            <MaterialCommunityIcons name="map-marker-path" size={40} color="#1976d2" />
            <View style={styles.trackText}>
              <Text style={styles.trackTitle}>Track Your Application</Text>
              <Text style={styles.trackSubtitle}>Enter reference number to track</Text>
            </View>
          </View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Track')}
            style={styles.trackButton}
          >
            Track Now
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Card
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Services', { category: category.name })}
            >
              <Card.Content style={styles.categoryContent}>
                <MaterialCommunityIcons
                  name={category.icon}
                  size={32}
                  color="#1976d2"
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Services')}
          >
            View All
          </Button>
        </View>
        {services.map((service) => (
          <Card
            key={service._id}
            style={styles.serviceCard}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
          >
            <Card.Content>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Chip mode="outlined" style={styles.priceChip}>
                  ₹{service.price}
                </Chip>
              </View>
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.supportCard}>
        <Card.Content>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Our legal experts are here to assist you
          </Text>
          <Button mode="outlined" style={styles.supportButton}>
            Contact Support
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1976d2',
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
  },
  trackCard: {
    margin: 16,
    marginTop: -30,
    elevation: 4,
  },
  trackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackText: {
    marginLeft: 16,
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  trackButton: {
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
  },
  categoryContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  categoryName: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  serviceCard: {
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  priceChip: {
    marginLeft: 8,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#444',
  },
  supportCard: {
    margin: 16,
    backgroundColor: '#e3f2fd',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  supportButton: {
    borderColor: '#1976d2',
  },
});

export default HomeScreen;
