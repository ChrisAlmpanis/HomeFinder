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

  await User.deleteMany();
  await Listing.deleteMany();
  await Appointment.deleteMany();
  console.log('Cleared existing data');

  const adminHash  = await bcrypt.hash('12345678', 10);
  const sellerHash = await bcrypt.hash('pass123', 10);
  const buyerHash  = await bcrypt.hash('buyer123', 10);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@homefinder.com',
    passwordHash: adminHash, role: 'admin', isApproved: true
  });

  const seller = await User.create({
    name: 'Sarah Mitchell', email: 'sarah.m@homefinder.com',
    passwordHash: sellerHash, role: 'seller', isApproved: true,
    agencyName: 'Mitchell Realty Athens'
  });

  const seller2 = await User.create({
    name: 'Yannis Papadopoulos', email: 'yannis.p@homefinder.com',
    passwordHash: sellerHash, role: 'seller', isApproved: false,
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

  const listings = await Listing.insertMany([

    // ── 10 FOR SALE ──────────────────────────────────────────

    {
      sellerID: seller._id,
      title: 'Luxury Apartment in Kolonaki',
      description: 'Elegant three-bedroom apartment in the heart of prestigious Kolonaki. Fully renovated with high-end finishes, oak parquet floors, and a private terrace offering stunning views of Lycabettus Hill. Minutes from top restaurants, boutiques, and the metro.',
      price: 520000, location: 'Kolonaki, Athens', type: 'Apartment',
      beds: 3, baths: 2, sqft: '148 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'k1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80' },
        { fileName: 'k2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&q=80' },
        { fileName: 'k3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop&q=80' },
        { fileName: 'k4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80' },
        { fileName: 'k5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Seafront Villa in Glyfada',
      description: 'Breathtaking five-bedroom seafront villa in upscale Glyfada with a private infinity pool, landscaped garden, and direct beach access. Open-plan living areas with floor-to-ceiling glass overlooking the Saronic Gulf.',
      price: 1250000, location: 'Glyfada, Athens', type: 'House',
      beds: 5, baths: 4, sqft: '320 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'g1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop&q=80' },
        { fileName: 'g2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80' },
        { fileName: 'g3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80' },
        { fileName: 'g4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop&q=80' },
        { fileName: 'g5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Penthouse with Acropolis Views in Makrygianni',
      description: 'Spectacular top-floor penthouse steps from the Acropolis Museum. Features a wraparound terrace with unobstructed Parthenon views, designer kitchen, master suite with walk-in wardrobe, and a private rooftop jacuzzi.',
      price: 780000, location: 'Makrygianni, Athens', type: 'Apartment',
      beds: 3, baths: 2, sqft: '175 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'm1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&q=80' },
        { fileName: 'm2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=500&fit=crop&q=80' },
        { fileName: 'm3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&q=80' },
        { fileName: 'm4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'm5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Family House in Kifisia',
      description: 'Spacious four-bedroom family home in leafy, upmarket Kifisia. Features a large private garden, swimming pool, double garage, and generous living spaces. Located in a quiet residential street close to top schools and amenities.',
      price: 650000, location: 'Kifisia, Athens', type: 'House',
      beds: 4, baths: 3, sqft: '240 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'ki1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ki2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1574739782594-db4ead022697?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ki3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ki4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ki5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Renovated Apartment in Plaka',
      description: 'Charming two-bedroom apartment in historic Plaka with Parthenon views from the rooftop terrace. Stone walls, vaulted ceilings, and modern kitchen blending heritage character with contemporary comfort. A rare find in Athens most visited neighbourhood.',
      price: 370000, location: 'Plaka, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '90 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'p1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&q=80' },
        { fileName: 'p2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'p3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=500&fit=crop&q=80' },
        { fileName: 'p4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=500&fit=crop&q=80' },
        { fileName: 'p5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Modern Studio in Exarchia',
      description: 'Stylish fully renovated studio in vibrant Exarchia. Open-plan layout with built-in storage, modern kitchen, and sunny south-facing balcony. Ideal for a first home or investment property — excellent rental yield potential.',
      price: 145000, location: 'Exarchia, Athens', type: 'Studio',
      beds: 1, baths: 1, sqft: '45 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'e1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80' },
        { fileName: 'e2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=500&fit=crop&q=80' },
        { fileName: 'e3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'e4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'e5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Townhouse in Psychiko',
      description: 'Elegant three-floor townhouse in the exclusive Psychiko district. Features four bedrooms, a home office, private courtyard garden, and a double garage. Surrounded by embassies and high-end residences in one of Athens\' most prestigious addresses.',
      price: 920000, location: 'Psychiko, Athens', type: 'House',
      beds: 4, baths: 3, sqft: '280 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'ps1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ps2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ps3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600047508788-786f3865b0be?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ps4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=500&fit=crop&q=80' },
        { fileName: 'ps5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Bright Apartment in Neos Kosmos',
      description: 'Spacious two-bedroom apartment in well-connected Neos Kosmos. Recently renovated throughout with new kitchen, updated bathrooms and double-glazed windows. Large balcony overlooking a quiet tree-lined street. Metro access nearby.',
      price: 210000, location: 'Neos Kosmos, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '82 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'nk1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=500&fit=crop&q=80' },
        { fileName: 'nk2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&q=80' },
        { fileName: 'nk3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop&q=80' },
        { fileName: 'nk4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'nk5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Neoclassical House in Thissio',
      description: 'Rare neoclassical detached house in sought-after Thissio with views of the Acropolis and Philopappos Hill. Lovingly restored with original period features alongside modern comforts. Private enclosed garden and rooftop terrace.',
      price: 850000, location: 'Thissio, Athens', type: 'House',
      beds: 4, baths: 2, sqft: '210 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 't1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80' },
        { fileName: 't2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80' },
        { fileName: 't3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&q=80' },
        { fileName: 't4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80' },
        { fileName: 't5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Investment Apartment in Piraeus',
      description: 'Well-maintained two-bedroom apartment near Piraeus port with balcony sea glimpses. Currently tenanted at market rent — ideal for investors seeking immediate yield in a high-demand rental area with strong transport links to central Athens.',
      price: 175000, location: 'Piraeus, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '70 m²', listingMode: 'buy', status: 'active',
      files: [
        { fileName: 'pi1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?w=800&h=500&fit=crop&q=80' },
        { fileName: 'pi2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&q=80' },
        { fileName: 'pi3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80' },
        { fileName: 'pi4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'pi5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=500&fit=crop&q=80' }
      ]
    },

    // ── 10 FOR RENT ──────────────────────────────────────────

    {
      sellerID: seller._id,
      title: 'Modern Apartment for Rent in Kolonaki',
      description: 'Sleek two-bedroom apartment available for rent in the heart of Kolonaki. Fully furnished with designer pieces, integrated kitchen appliances, and a private balcony with city views. Concierge building with secure parking.',
      price: 1800, location: 'Kolonaki, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '85 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rk1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rk2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rk3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rk4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rk5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Studio for Rent near Monastiraki',
      description: 'Compact and charming studio in the heart of the old town, steps from Monastiraki Square. Fully equipped with everything you need, including fast Wi-Fi, air-conditioning, and a kitchenette. Ideal for professionals and students.',
      price: 750, location: 'Monastiraki, Athens', type: 'Studio',
      beds: 1, baths: 1, sqft: '38 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rm1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rm2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rm3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rm4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rm5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Furnished Apartment for Rent in Exarchia',
      description: 'Bright and fully furnished three-bedroom apartment in lively Exarchia. Features a renovated kitchen, hardwood floors, and a large balcony. Bills not included. Available immediately. Ideal for a family or group of professionals.',
      price: 1350, location: 'Exarchia, Athens', type: 'Apartment',
      beds: 3, baths: 1, sqft: '105 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 're1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&q=80' },
        { fileName: 're2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&q=80' },
        { fileName: 're3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop&q=80' },
        { fileName: 're4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&q=80' },
        { fileName: 're5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'House for Rent in Kifisia',
      description: 'Beautiful three-bedroom detached house for rent in the prestigious northern suburb of Kifisia. Private garden, off-street parking, air-conditioning throughout. In a tranquil neighbourhood close to top international schools.',
      price: 2200, location: 'Kifisia, Athens', type: 'House',
      beds: 3, baths: 2, sqft: '160 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rki1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rki2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rki3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1574739782594-db4ead022697?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rki4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rki5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Apartment for Rent in Neos Kosmos',
      description: 'Well-maintained two-bedroom apartment for rent in Neos Kosmos close to the metro and Fix station. Features a spacious living area, fully equipped kitchen, and wraparound balcony. All bills included in rent.',
      price: 950, location: 'Neos Kosmos, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '75 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rnk1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rnk2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rnk3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rnk4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rnk5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Luxury Penthouse for Rent in Glyfada',
      description: 'Exceptional furnished penthouse for rent in prestigious Glyfada. Two bedrooms, two bathrooms, designer interiors, and a massive terrace with sea and city panoramas. Underground parking and concierge service included.',
      price: 3500, location: 'Glyfada, Athens', type: 'Apartment',
      beds: 2, baths: 2, sqft: '140 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rg1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rg2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rg3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rg4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rg5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Cosy Studio for Rent in Plaka',
      description: 'Cosy and characterful studio for rent in the historic Plaka neighbourhood. Stone walls, wooden beams, and a small private courtyard create a unique Athens living experience. Perfect for a single professional or couple.',
      price: 850, location: 'Plaka, Athens', type: 'Studio',
      beds: 1, baths: 1, sqft: '40 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rpl1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpl2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpl3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpl4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpl5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Townhouse for Rent in Thissio',
      description: 'Stylish three-floor townhouse for rent in sought-after Thissio with partial Acropolis views. Features three bedrooms, a rooftop terrace, private parking, and a contemporary open-plan ground floor. Available furnished or unfurnished.',
      price: 2800, location: 'Thissio, Athens', type: 'House',
      beds: 3, baths: 2, sqft: '185 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rt1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rt2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rt3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600047508788-786f3865b0be?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rt4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rt5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Apartment for Rent in Piraeus',
      description: 'Bright and spacious two-bedroom apartment for rent near Piraeus port with sea-glimpse balcony. Recently painted and updated. Close to the metro line 1, making central Athens easily accessible. Pets considered.',
      price: 900, location: 'Piraeus, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '72 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rpi1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpi2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpi3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpi4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpi5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&q=80' }
      ]
    },

    {
      sellerID: seller._id,
      title: 'Renovated Apartment for Rent in Pagkrati',
      description: 'Lovely renovated two-bedroom apartment for rent in charming Pagkrati, one of Athens\' most liveable neighbourhoods. Features high ceilings, original wooden floors, and a generous balcony. Walking distance to Zappeion gardens and Syntagma.',
      price: 1100, location: 'Pagkrati, Athens', type: 'Apartment',
      beds: 2, baths: 1, sqft: '80 m²', listingMode: 'rent', status: 'active',
      files: [
        { fileName: 'rpg1.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpg2.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpg3.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpg4.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&q=80' },
        { fileName: 'rpg5.jpg', fileType: 'image', fileURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&q=80' }
      ]
    },

  ]);

  console.log('Listings created:', listings.length);

  await Appointment.insertMany([
    {
      buyerID: buyer._id, listingID: listings[0]._id,
      scheduledAt: new Date('2026-04-22'), time: '10:00', status: 'confirmed'
    },
    {
      buyerID: buyer._id, listingID: listings[2]._id,
      scheduledAt: new Date('2026-04-28'), time: '14:30', status: 'confirmed'
    },
    {
      buyerID: buyer._id, listingID: listings[4]._id,
      scheduledAt: new Date('2026-05-05'), time: '11:00', status: 'confirmed'
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