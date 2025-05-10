const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { createSeller } = require('../validation/sellerValidation');
const { validation } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.post('/', protect, validation(createSeller), sellerController.createSeller);
router.get('/products', protect, sellerController.getSellerProducts);

module.exports = router;