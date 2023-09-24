require('dotenv').config();

const express = require('express');
const expressConfig = require('./config/express');
const dbConfig = require('./config/database');
const estateRoutes = require('./routes/estateRoutes');

const app = express();

(async () => {
	await dbConfig(app);
	expressConfig(app);

	app.get('/', (req, res) => {
		res.json({ message: 'Welcome to the backend API!' });
	});

	app.use('/api', estateRoutes);

	const port = process.env.PORT || 8000;

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}/`);
	});
})();

module.exports = app;
