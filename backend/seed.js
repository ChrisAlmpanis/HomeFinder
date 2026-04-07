const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Listing = require('./models/Listing');
const Appointment = require('./models/Appointment');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany();
  await Listing.deleteMany();
  await Appointment.deleteMany();
  console.log('Cleared existing data');

  // Create users
  const adminHash   = await bcrypt.hash('12345678', 10);
  const sellerHash  = await bcrypt.hash('pass123', 10);
  const buyerHash   = await bcrypt.hash('buyer123', 10);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@homefinder.com',
    passwordHash: adminHash, role: 'admin', isApproved: true
  });

  const seller = await User.create({
    name: 'Sarah Mitchell', email: 'sarah.m@homefinder.com',
    passwordHash: sellerHash, role: 'seller', isApproved: true,
    agencyName: 'Mitchell Realty'
  });

  const seller2 = await User.create({
    name: 'Yannis Papadopoulos', email: 'yannis.p@homefinder.com',
    passwordHash: sellerHash, role: 'seller', isApproved: true,
    agencyName: 'Athens Premium Properties'
  });

  const buyer = await User.create({
    name: 'James Thompson', email: 'james.t@homefinder.com',
    passwordHash: buyerHash, role: 'buyer', isApproved: true
  });

  const buyer2 = await User.create({
    name: 'Ana Rodriguez', email: 'ana.r@homefinder.com',
    passwordHash: buyerHash, role: 'buyer', isApproved: false
  });

  console.log('Users created');

  // Create listings
  const listings = await Listing.insertMany([
    {
      sellerID: seller._id, title: 'Refined House in Kolonaki',
      description: 'Refined three-bedroom house in prestigious Kolonaki. High ceilings, oak floors and a private terrace with Acropolis views.',
      price: 485000, location: 'Kolonaki, Athens', type: 'House',
      beds: 3, baths: 2, sqft: '145 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'kolonaki.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller._id, title: 'Bright Apartment in Exarchia',
      description: 'Bright two-bedroom apartment in vibrant Exarchia. Renovated kitchen, wooden floors and a sunny balcony.',
      price: 280000, location: 'Exarchia, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '78 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'exarchia.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller2._id, title: 'Seafront Villa in Glyfada',
      description: 'Stunning five-bedroom seafront villa in Glyfada with private pool and direct beach access.',
      price: 890000, location: 'Glyfada, Athens', type: 'House',
      beds: 5, baths: 3, sqft: '280 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'glyfada.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller._id, title: 'Studio near Monastiraki',
      description: 'Compact studio steps from Monastiraki Square and the Acropolis. Fully renovated with modern fixtures.',
      price: 155000, location: 'Monastiraki, Athens', type: 'Studio',
      beds: 1, baths: 1, sqft: '42 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'monastiraki.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller2._id, title: 'Family House in Kifisia',
      description: 'Beautiful four-bedroom house in leafy Kifisia. Large private garden and off-street parking.',
      price: 620000, location: 'Kifisia, Athens', type: 'House',
      beds: 4, baths: 2, sqft: '200 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'kifisia.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller._id, title: 'Apartment with Parthenon Views in Plaka',
      description: 'Characterful apartment in historic Plaka with Parthenon views from the rooftop terrace.',
      price: 350000, location: 'Plaka, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '88 m²', listingMode: 'buy', status: 'active',
      files: [{ fileName: 'plaka.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80' }]
    },
    {
      sellerID: seller2._id, title: 'Apartment for Rent in Piraeus',
      description: 'Well-maintained two-bedroom apartment near Piraeus port. Balcony with sea glimpses.',
      price: 820, location: 'Piraeus, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '65 m²', listingMode: 'rent', status: 'active',
      files: [{ fileName: 'piraeus.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80' }]
    },
  ]);

  console.log('Listings created');

  // Create appointments
  await Appointment.insertMany([
    {
      buyerID: buyer._id, listingID: listings[0]._id,
      scheduledAt: new Date('2026-05-08'), time: '10:00 AM', status: 'confirmed'
    },
    {
      buyerID: buyer._id, listingID: listings[2]._id,
      scheduledAt: new Date('2026-05-14'), time: '2:30 PM', status: 'confirmed'
    },
    {
      buyerID: buyer2._id, listingID: listings[1]._id,
      scheduledAt: new Date('2026-05-20'), time: '11:00 AM', status: 'pending'
    },
  ]);

  console.log('Appointments created');
  console.log('✅ Database seeded successfully!');
  console.log('---');
  console.log('Login credentials:');
  console.log('Admin:  admin@homefinder.com  / 12345678');
  console.log('Seller: sarah.m@homefinder.com / pass123');
  console.log('Buyer:  james.t@homefinder.com / buyer123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});