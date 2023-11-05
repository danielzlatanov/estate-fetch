require('events').EventEmitter.defaultMaxListeners = 15;
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;
const connectionString = process.env.MONGODB_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose
	.connect(connectionString, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('database connection established.');
	})
	.catch(err => {
		console.error('error connecting to MongoDB Atlas:', err.message);
		process.exit(1);
	});

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the backend API!' });
});

const estateRoutes = require('./routes/estateRoutes.js');
app.use('/api', estateRoutes);

app.listen(port, () => {
	console.log(`server is running on http://localhost:${port}/`);
});

module.exports = app;
