const router = require('express').Router();
const estateController = require('../controllers/estate');
const secretToken = process.env.SECRET_TOKEN;

function verifyToken(req, res, next) {
	const token = req.headers['x-secret-token'];
	if (!token || token !== secretToken) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	next();
}

router.get('/scrape', verifyToken, estateController.scrapeAndSaveEstateData);
router.get(['/estates', '/estates/search'], estateController.getAllEstates);
router.get('/estates/:id', estateController.getEstateById);

module.exports = router;
