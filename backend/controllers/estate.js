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
		const query = {};
		const { keywords } = req.query;

		if (keywords) {
			query.title = new RegExp(keywords, 'i');
		}

		const estates = await Estate.find(query).lean();
		res.json(estates);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};


const getEstateById = async (req, res) => {
	const estateId = req.params.id;

	try {
		const estate = await Estate.findById(estateId).lean();
		if (!estate) {
			res.status(404).json({ error: 'Estate not found' });
		} else {
			res.json(estate);
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = {
	getAllEstates,
	getEstateById,
	scrapeAndSaveEstateData,
};
