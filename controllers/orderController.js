const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return next(new AppError(400, 'Products are required to create an order'));
  }

  const order = await Order.create({
    user: req.user._id,
    products,
    paymentMethod: 'cash_on_delivery',
  });

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [], updatedAt: Date.now() },
    { new: true }
  );

  if (!cart) {
    return next(new AppError(404, 'Cart not found for this user'));
  }

  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate('products');

  if (!orders || orders.length === 0) {
    return next(new AppError(404, 'No orders found for this user'));
  }

  res.status(200).json({
    status: 'success',
    data: orders,
  });
});