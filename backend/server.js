const express = require('express');
const expressConfig = require('./config/express');
const dbConfig = require('./config/database');
const estateRoutes = require('./routes/estateRoutes');

start();
async function start() {
	const app = express();

	await dbConfig(app);
	expressConfig(app);

	app.get('/', (req, res) => {
		res.json({ message: 'Welcome to the backend API!' });
	});

	app.use('/api', estateRoutes);

	const port = process.env.PORT || 8000;
	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
}
