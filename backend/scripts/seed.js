require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@letslegal.com',
      password: 'Admin@123',
      phone: '1234567890',
      role: 'admin'
    });
    console.log('Admin user created:', admin.email);

    // Create sample services
    const services = [
      {
        name: 'Legal Consultation',
        description: 'Get expert legal advice from experienced lawyers for your business or personal matters.',
        category: 'Legal Consultation',
        price: 1999,
        estimatedDuration: '1-2 days',
        features: [
          'One-on-one consultation with lawyer',
          'Case analysis and legal opinion',
          'Personalized legal advice',
          'Follow-up support'
        ],
        requiredDocuments: [
          'ID Proof',
          'Relevant case documents',
          'Previous legal correspondence (if any)'
        ],
        isActive: true
      },
      {
        name: 'Company Registration',
        description: 'Complete assistance for private limited company, LLP, or partnership firm registration.',
        category: 'Company Registration',
        price: 9999,
        estimatedDuration: '7-14 days',
        features: [
          'Name approval assistance',
          'Documentation preparation',
          'ROC filing',
          'Certificate of Incorporation'
        ],
        requiredDocuments: [
          'PAN Card of Directors',
          'Address Proof',
          'Passport size photographs',
          'Registered office proof'
        ],
        isActive: true
      },
      {
        name: 'GST Registration',
        description: 'Quick and hassle-free GST registration for your business with complete documentation support.',
        category: 'GST Services',
        price: 2999,
        estimatedDuration: '5-7 days',
        features: [
          'GST registration filing',
          'Documentation support',
          'GSTIN certificate',
          'Post-registration support'
        ],
        requiredDocuments: [
          'PAN Card',
          'Aadhaar Card',
          'Business address proof',
          'Bank account details',
          'Photograph'
        ],
        isActive: true
      },
      {
        name: 'Trademark Registration',
        description: 'Protect your brand with trademark registration and get exclusive rights to your brand name/logo.',
        category: 'Trademark & IPR',
        price: 7999,
        estimatedDuration: '12-18 months',
        features: [
          'Trademark search',
          'Application filing',
          'Objection handling',
          'Registration certificate'
        ],
        requiredDocuments: [
          'Trademark logo/wordmark',
          'Applicant ID proof',
          'Business details',
          'Power of attorney'
        ],
        isActive: true
      },
      {
        name: 'Legal Notice Drafting',
        description: 'Professional legal notice drafting and sending service for various legal disputes.',
        category: 'Legal Notice',
        price: 2499,
        estimatedDuration: '2-3 days',
        features: [
          'Professional notice drafting',
          'Legal review',
          'Dispatch via registered post',
          'Proof of delivery'
        ],
        requiredDocuments: [
          'Details of the dispute',
          'Supporting documents',
          'Recipient details'
        ],
        isActive: true
      },
      {
        name: 'GST Return Filing',
        description: 'Monthly/Quarterly GST return filing service with complete accuracy and on-time submission.',
        category: 'GST Services',
        price: 1499,
        estimatedDuration: '3-5 days',
        features: [
          'GSTR-1, GSTR-3B filing',
          'Input tax credit reconciliation',
          'Error-free filing',
          'Acknowledgment copy'
        ],
        requiredDocuments: [
          'GST credentials',
          'Sales and purchase invoices',
          'Previous returns'
        ],
        isActive: true
      },
      {
        name: 'Partnership Deed Drafting',
        description: 'Comprehensive partnership deed drafting service for new or existing partnerships.',
        category: 'Contract Drafting',
        price: 4999,
        estimatedDuration: '3-5 days',
        features: [
          'Customized deed drafting',
          'Legal compliance check',
          'Notarization support',
          'Digital copy'
        ],
        requiredDocuments: [
          'Partner details',
          'Business details',
          'Capital contribution details'
        ],
        isActive: true
      },
      {
        name: 'Property Document Verification',
        description: 'Complete property document verification to ensure clear title and legal ownership.',
        category: 'Property Documentation',
        price: 5999,
        estimatedDuration: '7-10 days',
        features: [
          'Title search',
          'Document verification',
          'Legal opinion',
          'Detailed report'
        ],
        requiredDocuments: [
          'Property documents',
          'Sale deed',
          'Previous ownership records',
          'Property tax receipts'
        ],
        isActive: true
      }
    ];

    await Service.insertMany(services);
    console.log('Sample services created');

    console.log('\n=================================');
    console.log('Seed data created successfully!');
    console.log('=================================');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@letslegal.com');
    console.log('Password: Admin@123');
    console.log('\n=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
