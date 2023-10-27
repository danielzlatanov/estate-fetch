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

		let {
			page = 1,
			perPage = 9,
			keywords,
			location,
			minPrice,
			maxPrice,
			minArea,
			roomCount,
			construction,
		} = req.query;
		page = Number(page);
		perPage = Number(perPage);
		minArea = Number(minArea);
		minPrice = Number(minPrice);
		maxPrice = Number(maxPrice);

		if (keywords) {
			query.$or = [
				{ title: new RegExp(keywords, 'i') },
				{ location: new RegExp(keywords, 'i') },
				{ description: new RegExp(keywords, 'i') },
			];
		}

		if (location) {
			query.location = { $regex: new RegExp(location, 'i') };
		}
		if (minPrice) {
			query.price = { $gte: minPrice };
		}
		if (maxPrice) {
			query.price = { ...query.price, $lte: maxPrice };
		}
		if (minArea) {
			query.area = { $gte: minArea };
		}
		if (roomCount) {
			query.title = { $regex: new RegExp(roomCount, 'i') };
		}
		if (construction) {
			query.construction = { $regex: new RegExp(construction, 'i') };
		}

		const totalEstates = await Estate.countDocuments(query);
		const totalPages = Math.ceil(totalEstates / perPage);

		if (isNaN(page) || page <= 0 || page > totalPages) {
			page = 1;
		}

		if (perPage !== 9) {
			perPage = 9;
		}

		const estates = await Estate.find(query)
			.skip((page - 1) * perPage)
			.limit(perPage)
			.lean();

		res.json({
			estates,
			page,
			totalPages,
		});
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
