/**
 * Database Seeder - Creates demo data for testing
 * Run with: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
const Subscription = require('./models/Subscription');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/daily-news';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Article.deleteMany({});
    await Subscription.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create demo users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@news.com',
        password: 'password123',
        role: 'admin',
        subscription: { type: 'yearly', isActive: true }
      },
      {
        name: 'Editor User',
        email: 'editor@news.com',
        password: 'password123',
        role: 'editor',
        subscription: { type: 'yearly', isActive: true }
      },
      {
        name: 'Regular User',
        email: 'user@news.com',
        password: 'password123',
        role: 'subscriber',
        subscription: { type: 'monthly', isActive: true }
      }
    ];

    const createdUsers = await User.create(users);
    console.log('✅ Created 3 demo users');

    // Create demo articles
    const articles = [
      {
        title: 'Breaking News: Major Tech Breakthrough Announced',
        summary: 'Scientists announce a groundbreaking discovery that could revolutionize the industry.',
        content: 'A team of researchers has made a significant breakthrough in quantum computing. The new technology promises to solve complex problems at unprecedented speeds...',
        category: 'technology',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500',
        isPremium: false,
        isBreakingNews: true,
        views: 1250
      },
      {
        title: 'Global Economy Shows Signs of Recovery',
        summary: 'Economic indicators suggest positive growth across major markets worldwide.',
        content: 'Recent data from international finance organizations shows that the global economy is on a recovery path with positive GDP growth in most regions...',
        category: 'business',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-adf4e565db12?w=500',
        isPremium: true,
        isBreakingNews: false,
        views: 890
      },
      {
        title: 'International Summit Discusses Climate Action',
        summary: 'World leaders gather to discuss urgent climate change policies.',
        content: 'Representatives from over 190 countries met yesterday to discuss coordinated action on climate change. Key agreements were reached on emission reductions and green energy investments...',
        category: 'world',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=500',
        isPremium: false,
        isBreakingNews: true,
        views: 2100
      },
      {
        title: 'Championship Team Wins Historic Victory',
        summary: 'Local team claims national championship with spectacular performance.',
        content: 'In an exciting match that kept fans on the edge of their seats, the home team won the championship with a dramatic last-minute goal...',
        category: 'sports',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
        isPremium: false,
        isBreakingNews: false,
        views: 1650
      },
      {
        title: 'New Political Reforms Passed by Parliament',
        summary: 'Government implements comprehensive policy changes following public consultation.',
        content: 'After months of debate and public consultation, parliament has approved a series of new reforms aimed at improving governance and transparency...',
        category: 'politics',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1552508744-04a1f3b91d85?w=500',
        isPremium: true,
        isBreakingNews: false,
        views: 1340
      },
      {
        title: 'Blockbuster Movie Breaks Box Office Records',
        summary: 'Latest film release sets new attendance records on opening weekend.',
        content: 'The highly anticipated movie release exceeded all expectations, breaking box office records with massive audience attendance across the country...',
        category: 'entertainment',
        author: createdUsers[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1533613220915-6f7ee359b0b2?w=500',
        isPremium: false,
        isBreakingNews: false,
        views: 2300
      }
    ];

    const createdArticles = await Article.create(articles);
    console.log('✅ Created 6 demo articles');

    // Create subscriptions for each user
    const subscriptions = [
      {
        userId: createdUsers[0]._id,
        planType: 'yearly',
        status: 'active',
        price: 99.99,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        autoRenewal: true
      },
      {
        userId: createdUsers[1]._id,
        planType: 'yearly',
        status: 'active',
        price: 99.99,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        autoRenewal: true
      },
      {
        userId: createdUsers[2]._id,
        planType: 'monthly',
        status: 'active',
        price: 9.99,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        autoRenewal: true
      }
    ];

    await Subscription.create(subscriptions);
    console.log('✅ Created 3 subscriptions');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Demo Accounts Created:');
    console.log('   Admin:  admin@news.com / password123');
    console.log('   Editor: editor@news.com / password123');
    console.log('   User:   user@news.com / password123');
    console.log('\n📰 Articles Created: 6');
    console.log('   - 2 Breaking News articles');
    console.log('   - 2 Premium articles');
    console.log('   - 6 total articles across all categories');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
