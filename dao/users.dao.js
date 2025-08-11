require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/users.model');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const newUser = new User({
    firstName: 'test_name',
    lastName: 'test_lastname',
    email: 'test@mail.com',
    password: 'hashedpasswordhere',
    role: 1, // Replace with a real Role ObjectId or create a Role first
    active: true
  });

  await newUser.save();

  console.log('User saved!');
  mongoose.connection.close();
}

run().catch(console.error);
