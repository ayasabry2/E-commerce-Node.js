const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { addToCart, updateCart } = require('../validation/cartValidation');
const { validation } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.post('/', protect, cartController.createCart);
router.post('/add', protect, validation(addToCart), cartController.addToCart);
router.put('/remove', protect, validation(updateCart), cartController.updateCart);
router.get('/', protect, cartController.getCart);

module.exports = router;