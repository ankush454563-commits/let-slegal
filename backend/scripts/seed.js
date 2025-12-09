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
        name: 'Company Incorporation',
        description: 'Register your business as Private Limited, LLP, OPC, or Partnership firm with complete documentation.',
        category: 'Company Registration',
        price: 6999,
        processingTime: '7-14 days',
        features: [
          'Private Limited Company',
          'Limited Liability Partnership (LLP)',
          'One Person Company (OPC)',
          'Partnership Firm',
          'Sole Proprietorship',
          'Complete documentation support'
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
        name: 'Annual Compliance',
        description: 'Stay compliant with all regulatory requirements. ROC filings, GST returns, IT returns, and more.',
        category: 'Compliance',
        price: 3999,
        processingTime: 'Ongoing/year',
        features: [
          'ROC Annual Filings',
          'GST Return Filing',
          'Income Tax Returns',
          'TDS Returns',
          'Audit Reports',
          'DIN & DSC Services'
        ],
        requiredDocuments: [
          'Company Registration Details',
          'Financial Statements',
          'Previous Returns',
          'Bank Statements'
        ],
        isActive: true
      },
      {
        name: 'Legal Litigation',
        description: 'Expert legal representation for civil, criminal, corporate, and property disputes.',
        category: 'Legal Consultation',
        price: 2999,
        processingTime: 'Case dependent',
        features: [
          'Civil Litigation',
          'Criminal Cases',
          'Corporate Disputes',
          'Property Matters',
          'Family Law',
          'Consumer Court Cases'
        ],
        requiredDocuments: [
          'Case Details',
          'Relevant Documents',
          'Previous Court Orders (if any)',
          'ID Proof'
        ],
        isActive: true
      },
      {
        name: 'Tender Tie-Up',
        description: 'Complete support for government tenders, including registration, bidding, and documentation.',
        category: 'Other',
        price: 0, // Custom pricing
        processingTime: 'Project based',
        features: [
          'Tender Registration',
          'Bid Preparation',
          'Document Support',
          'GeM Registration',
          'EMD & Bank Guarantee',
          'Performance Bank Guarantee'
        ],
        requiredDocuments: [
          'Company Registration',
          'GST Certificate',
          'PAN Card',
          'Bank Account Details',
          'Project Experience Documents'
        ],
        isActive: true
      },
      {
        name: 'FSSAI Registration',
        description: 'Food license registration and renewal for restaurants, food trucks, and food product manufacturers.',
        category: 'Other',
        price: 1499,
        processingTime: '15-30 days',
        features: [
          'Basic FSSAI Registration',
          'State License',
          'Central License',
          'FosCos Compliance',
          'Hygiene Rating',
          'Annual Returns'
        ],
        requiredDocuments: [
          'Business Proof',
          'ID and Address Proof',
          'Food Category Details',
          'List of Food Products'
        ],
        isActive: true
      },
      {
        name: 'Shop & Establishment',
        description: 'Mandatory registration for shops, commercial establishments, and offices under state laws.',
        category: 'Other',
        price: 2499,
        processingTime: '7-10 days',
        features: [
          'New Registration',
          'License Renewal',
          'Amendment in Details',
          'Closure Intimation',
          'Compliance Maintenance',
          'Labor Law Advisory'
        ],
        requiredDocuments: [
          'Business Address Proof',
          'Owner ID Proof',
          'Employee Details',
          'Rent Agreement'
        ],
        isActive: true
      },
      {
        name: 'MSME / Udyam Registration',
        description: 'Get your business registered under MSME to avail government benefits and subsidies.',
        category: 'Other',
        price: 999,
        processingTime: '1-3 days',
        features: [
          'Udyam Registration',
          'Udyog Aadhar Update',
          'MSME Databank',
          'Priority Sector Lending',
          'Subsidy Schemes',
          'Delayed Payment Protection'
        ],
        requiredDocuments: [
          'Aadhaar Card',
          'PAN Card',
          'Business Details',
          'Bank Account Details'
        ],
        isActive: true
      },
      {
        name: 'Digital Signature (DSC)',
        description: 'Class 3 Digital Signature Certificates for e-tendering, ROC filing, and GST filing.',
        category: 'Other',
        price: 1999,
        processingTime: 'Same day',
        features: [
          'Class 3 Signing',
          'Class 3 Signing + Encryption',
          'DGFT DSC',
          'Token Inclusion',
          'Paperless Process',
          'Same Day Issuance'
        ],
        requiredDocuments: [
          'PAN Card',
          'Aadhaar Card',
          'Photograph',
          'Email & Mobile'
        ],
        isActive: true
      },
      {
        name: 'Import Export Code (IEC)',
        description: 'IEC registration for businesses looking to import or export goods and services.',
        category: 'Other',
        price: 2999,
        processingTime: '7-10 days',
        features: [
          'New IEC Application',
          'IEC Modification',
          'RCMC Registration',
          'Export Promotion Schemes',
          'Customs Compliance',
          'AD Code Registration'
        ],
        requiredDocuments: [
          'PAN Card',
          'Aadhaar Card',
          'Business Proof',
          'Bank Certificate',
          'Cancelled Cheque'
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
