import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../config/api';

const ServiceDetailScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data.service);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Chip mode="flat" style={styles.categoryChip}>
            {service.category}
          </Chip>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.price}>₹{service.price}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{service.description}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#1976d2" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Processing Time</Text>
              <Text style={styles.infoValue}>{service.processingTime}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {service.requiredDocuments && service.requiredDocuments.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            {service.requiredDocuments.map((doc, index) => (
              <View key={index} style={styles.listItem}>
                <MaterialCommunityIcons name="file-document" size={20} color="#666" />
                <Text style={styles.listText}>{doc}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {service.formFields && service.formFields.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Information Required</Text>
            {service.formFields.map((field, index) => (
              <View key={index} style={styles.listItem}>
                <MaterialCommunityIcons name="form-textbox" size={20} color="#666" />
                <Text style={styles.listText}>
                  {field.label} {field.required && <Text style={styles.required}>*</Text>}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ApplicationForm', { service })}
          style={styles.applyButton}
          icon="file-document-edit"
        >
          Apply Now
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  card: {
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  required: {
    color: 'red',
  },
  buttonContainer: {
    padding: 16,
  },
  applyButton: {
    paddingVertical: 6,
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceDetailScreen;
