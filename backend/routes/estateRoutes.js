const router = require('express').Router();
const estateController = require('../controllers/estate');

router.get('/estates', estateController.getAllEstates);
router.get('/estates/:id', estateController.getEstateById);
router.post('/estates', estateController.createEstate);

module.exports = router;
