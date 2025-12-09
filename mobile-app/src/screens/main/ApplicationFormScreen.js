import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Text, TextInput, Button, Snackbar } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../config/api';

const ApplicationFormScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
      });

      if (result.type === 'success') {
        setDocuments([...documents, result]);
      }
    } catch (error) {
      console.error('Error picking documents:', error);
    }
  };

  const validateForm = () => {
    if (!service.formFields) return true;

    for (const field of service.formFields) {
      if (field.required && !formData[field.fieldName]) {
        setError(`${field.label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('serviceId', service._id);
      submitData.append('formData', JSON.stringify(formData));

      documents.forEach((doc, index) => {
        submitData.append('documents', {
          uri: doc.uri,
          type: doc.mimeType,
          name: doc.name,
        });
      });

      const response = await api.post('/applications', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { application } = response.data;

      // Navigate to payment
      navigation.navigate('Payment', {
        applicationId: application._id,
        amount: service.price,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.fieldType) {
      case 'textarea':
        return (
          <TextInput
            key={field.fieldName}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.fieldName] || ''}
            onChangeText={(value) => handleFieldChange(field.fieldName, value)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        );
      case 'email':
        return (
          <TextInput
            key={field.fieldName}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.fieldName] || ''}
            onChangeText={(value) => handleFieldChange(field.fieldName, value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        );
      case 'number':
        return (
          <TextInput
            key={field.fieldName}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.fieldName] || ''}
            onChangeText={(value) => handleFieldChange(field.fieldName, value)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        );
      default:
        return (
          <TextInput
            key={field.fieldName}
            label={field.label + (field.required ? ' *' : '')}
            value={formData[field.fieldName] || ''}
            onChangeText={(value) => handleFieldChange(field.fieldName, value)}
            mode="outlined"
            style={styles.input}
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.price}>Amount: ₹{service.price}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Application Details</Text>
            {service.formFields && service.formFields.map(renderField)}

            <Text style={styles.sectionTitle}>Upload Documents</Text>
            <Button
              mode="outlined"
              icon="file-upload"
              onPress={pickDocuments}
              style={styles.uploadButton}
            >
              Upload Documents ({documents.length})
            </Button>

            {documents.length > 0 && (
              <View style={styles.documentsContainer}>
                {documents.map((doc, index) => (
                  <Text key={index} style={styles.documentName}>
                    • {doc.name}
                  </Text>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Proceed to Payment
          </Button>
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
        >
          {error}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#1976d2',
  },
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 12,
  },
  documentsContainer: {
    marginTop: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 6,
  },
});

export default ApplicationFormScreen;
