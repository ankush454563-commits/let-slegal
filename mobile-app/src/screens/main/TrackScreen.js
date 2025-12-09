import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Text, Snackbar } from 'react-native-paper';
import api from '../../config/api';

const TrackScreen = ({ navigation }) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!referenceNumber.trim()) {
      setError('Please enter reference number');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/applications/track/${referenceNumber}`);
      
      navigation.navigate('ApplicationDetail', {
        applicationId: response.data.application._id,
        referenceNumber,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Application not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Track Your Application</Text>
          <Text style={styles.subtitle}>
            Enter your reference number to track the status of your application
          </Text>

          <TextInput
            label="Reference Number"
            value={referenceNumber}
            onChangeText={setReferenceNumber}
            mode="outlined"
            placeholder="e.g., LL12345678901"
            autoCapitalize="characters"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleTrack}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="magnify"
          >
            Track Application
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>How to track?</Text>
          <Text style={styles.infoText}>
            1. Find your reference number in the confirmation email{'\n'}
            2. Enter it in the field above{'\n'}
            3. View real-time status updates{'\n'}
            4. Submit additional information if requested
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Can't find your reference number?{'\n'}
            Check "My Applications" in your profile
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Profile', { screen: 'MyApplications' })}
            style={styles.linkButton}
          >
            View My Applications
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 6,
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 12,
  },
  linkButton: {
    marginTop: 8,
  },
});

export default TrackScreen;
