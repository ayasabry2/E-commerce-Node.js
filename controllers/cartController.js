const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createCart = catchAsync(async (req, res, next) => {
  const existingCart = await Cart.findOne({ user: req.user._id });
  if (existingCart) {
    return next(new AppError(400, 'Cart already exists for this user'));
  }

  const cart = await Cart.create({ user: req.user._id, products: [] });

  res.status(201).json({
    status: 'success',
    data: cart,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError(404, 'Product not found'));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      products: [{ product: productId, quantity }],
    });
  } else {
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
exports.updateCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError(404, 'Cart not found'));
  }

  if (cart.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return next(new AppError(403, 'Not authorized to update this cart'));
  }

  const productIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(new AppError(404, 'Product not found in cart'));
  }

  cart.products.splice(productIndex, 1);

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'products.product'
  );
  if (!cart) {
    return next(new AppError(404, 'Cart not found'));
  }

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
