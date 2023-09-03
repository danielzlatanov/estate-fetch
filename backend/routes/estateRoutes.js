const router = require('express').Router();
const estateController = require('../controllers/estate');

router.get('/estates', estateController.getAllEstates);
router.get('/estates/:id', estateController.getEstateById);

module.exports = router;
