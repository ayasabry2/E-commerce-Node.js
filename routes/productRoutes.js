const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { createProduct, updateProduct, searchProduct } = require('../validation/productValidation');
const { validation } = require('../middlewares/validation');
const { protect, restrictToSeller } = require('../middlewares/auth');

router.get('/', protect, validation(searchProduct), productController.getProducts);
router.post('/', protect, restrictToSeller, validation(createProduct), productController.createProduct);
router.put('/:id', protect, restrictToSeller, validation(updateProduct), productController.updateProduct);
router.delete('/:id', protect, restrictToSeller, productController.deleteProduct);

module.exports = router;