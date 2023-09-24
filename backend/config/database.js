const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URL;

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