const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/estate-fetch';

module.exports = async (app) => {
  try {
    await mongoose.connect(connectionString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log('Database connection established.');
  } catch (err) {
    console.error('Error connecting to MongoDB:');
    console.error(err.message);
    process.exit(1);
  }
};