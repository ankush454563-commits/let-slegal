import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import api from '../../config/api';

const PaymentScreen = ({ route, navigation }) => {
  const { applicationId, amount } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order
      const orderResponse = await api.post('/payments/create-order', {
        applicationId,
        amount,
      });

      const { order, paymentId } = orderResponse.data;

      // In a real app, integrate Razorpay SDK here
      // For now, simulate successful payment
      setTimeout(async () => {
        try {
          // Simulate payment verification
          const verifyResponse = await api.post('/payments/verify', {
            razorpay_order_id: order.id,
            razorpay_payment_id: 'pay_' + Date.now(),
            razorpay_signature: 'signature_' + Date.now(),
            paymentId,
          });

          const { application } = verifyResponse.data;

          navigation.replace('ApplicationDetail', {
            applicationId: application._id,
            referenceNumber: application.referenceNumber,
          });
        } catch (verifyError) {
          setError('Payment verification failed');
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Payment Summary</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Service Amount</Text>
            <Text style={styles.value}>₹{amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>GST (18%)</Text>
            <Text style={styles.value}>₹{(amount * 0.18).toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{(amount * 1.18).toFixed(2)}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <Text style={styles.infoText}>
            • Payment is 100% secure and encrypted{'\n'}
            • You will receive a reference number after payment{'\n'}
            • Track your application status anytime{'\n'}
            • Refund available if service cannot be completed
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            mode="contained"
            onPress={handlePayment}
            style={styles.payButton}
            icon="credit-card"
          >
            Pay ₹{(amount * 1.18).toFixed(2)}
          </Button>
        )}
      </View>

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
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
  },
  buttonContainer: {
    marginTop: 16,
  },
  payButton: {
    paddingVertical: 6,
  },
});

export default PaymentScreen;
