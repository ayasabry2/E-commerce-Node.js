const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register, login, updateUser, forgotPassword } = require('../validation/authValidation');
const { validation } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.post('/register', validation(register), authController.register);
router.post('/login', validation(login), authController.login);
router.put('/update', protect, validation(updateUser), authController.updateUser);
router.post('/forgot-password', validation(forgotPassword), authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.delete('/', protect, authController.deleteUser);
module.exports = router;