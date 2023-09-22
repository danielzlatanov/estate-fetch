const router = require('express').Router();
const estateController = require('../controllers/estate');

router.get('/scrape', estateController.scrapeAndSaveEstateData);
router.get(['/estates', '/estates/search'], estateController.getAllEstates);
router.get('/estates/:id', estateController.getEstateById);

module.exports = router;
