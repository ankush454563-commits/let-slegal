import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import api from '../../config/api';

const ServicesScreen = ({ navigation, route }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'All');

  const categories = [
    'All',
    'Legal Consultation',
    'Company Registration',
    'GST Services',
    'Trademark & IPR',
    'Contract Drafting',
    'Legal Notice',
    'Property Documentation',
    'Tax Advisory',
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services?isActive=true');
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const renderService = ({ item }) => (
    <Card
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item._id })}
    >
      <Card.Content>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Chip mode="outlined" style={styles.priceChip}>
            ₹{item.price}
          </Chip>
        </View>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <Text style={styles.serviceDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.processingTime}>
          Processing: {item.processingTime}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search services..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => setSelectedCategory(item)}
            style={styles.categoryChip}
          >
            {item}
          </Chip>
        )}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderService}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.servicesList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No services found</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  servicesList: {
    padding: 16,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priceChip: {
    marginLeft: 8,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  processingTime: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default ServicesScreen;
