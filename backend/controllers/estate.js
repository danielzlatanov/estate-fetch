const scraper = require('../services/scraper');
const Estate = require('../models/Estate');

const scrapeAndSaveEstateData = async (req, res) => {
	try {
		const realEstateData = await scraper.scrapeDataWithRetry();

		if (realEstateData == null) {
			throw new Error('Scraped data is not an array');
		}

		//! DB save
		// const savedEstates = await Promise.all(
		// 	realEstateData.map(async estateData => {
		// 		const estate = new Estate(estateData);
		// 		return await estate.save();
		// 	})
		// );

		res.json({ message: 'Real estate data scraped and saved successfully.', savedEstates });
	} catch (err) {
		console.error('Error scraping and saving real estate data:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const getAllEstates = async (req, res) => {
	try {
		const estates = await Estate.find({}).lean();
		res.json(estates);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

const getEstateById = (req, res) => {
	res.json({ message: 'You have received specific info regarding an estate.' });
};

module.exports = {
	getAllEstates,
	getEstateById,
	scrapeAndSaveEstateData,
};
