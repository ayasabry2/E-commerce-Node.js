const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { createOrder } = require('../validation/orderValidation');
const { validation } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.post('/', protect, validation(createOrder), orderController.createOrder);
router.get('/', protect, orderController.getOrders);

module.exports = router;