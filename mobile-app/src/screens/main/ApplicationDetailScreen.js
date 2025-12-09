import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../config/api';

const ApplicationDetailScreen = ({ route }) => {
  const { applicationId, referenceNumber } = route.params;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      setApplication(response.data.application);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'failed': return '#f44336';
      case 'additional-info-required': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'clock-outline';
      case 'in-progress': return 'progress-clock';
      case 'completed': return 'check-circle';
      case 'failed': return 'close-circle';
      case 'additional-info-required': return 'file-document-edit';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!application) {
    return (
      <View style={styles.errorContainer}>
        <Text>Application not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.refNumber}>Ref: {application.referenceNumber}</Text>
          <Text style={styles.serviceName}>{application.service?.name}</Text>
          
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon(application.status)}
              size={24}
              color={getStatusColor(application.status)}
            />
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getStatusColor(application.status) + '20' }]}
              textStyle={{ color: getStatusColor(application.status) }}
            >
              {application.status.replace('-', ' ').toUpperCase()}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Payment Status</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid</Text>
            <Text style={styles.value}>₹{application.payment?.amount || 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status</Text>
            <Chip mode="outlined" style={styles.paymentChip}>
              {application.paymentStatus}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {application.additionalFormRequests && application.additionalFormRequests.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Additional Information Required</Text>
            {application.additionalFormRequests.map((request, index) => (
              <View key={index} style={styles.formRequest}>
                <Text style={styles.formTitle}>{request.form?.title}</Text>
                <Text style={styles.formDesc}>{request.form?.description}</Text>
                {request.status === 'pending' && (
                  <Button mode="contained" style={styles.formButton}>
                    Submit Information
                  </Button>
                )}
                {request.status === 'submitted' && (
                  <Chip mode="flat" icon="check">Submitted</Chip>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Status History</Text>
          {application.statusHistory?.map((history, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyStatus}>{history.status}</Text>
                <Text style={styles.historyDate}>
                  {new Date(history.changedAt).toLocaleString()}
                </Text>
                {history.notes && (
                  <Text style={styles.historyNotes}>{history.notes}</Text>
                )}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {application.documents && application.documents.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Uploaded Documents</Text>
            {application.documents.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <MaterialCommunityIcons name="file-document" size={20} color="#666" />
                <Text style={styles.documentName}>{doc.fileName}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
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
  refNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusChip: {
    marginLeft: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentChip: {
    height: 28,
  },
  formRequest: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  formDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  formButton: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    marginTop: 4,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: '#444',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentName: {
    marginLeft: 12,
    fontSize: 14,
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

export default ApplicationDetailScreen;
