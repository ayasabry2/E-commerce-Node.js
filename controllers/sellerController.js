const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Seller = require('../models/Seller');
const Product = require('../models/Product');

exports.createSeller = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError(400, 'Seller name is required'));
  }

  const existingSeller = await Seller.findOne({ user: req.user._id });
  if (existingSeller) {
    return next(new AppError(400, 'User is already a seller'));
  }

  const seller = await Seller.create({ name, user: req.user._id });
  req.user.isSeller = true;
  await req.user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: seller,
  });
});

exports.getSellerProducts = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    return next(new AppError(403, 'Not a seller'));
  }

  const products = await Product.find({ seller: seller._id });

  if (!products || products.length === 0) {
    return next(new AppError(404, 'No products found for this seller'));
  }

  res.status(200).json({
    status: 'success',
    data: products,
  });
});

exports.updateSeller = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError(400, 'Seller name is required'));
  }

  const seller = await Seller.findOneAndUpdate(
    { user: req.user._id },
    { name },
    { new: true, runValidators: true }
  );

  if (!seller) {
    return next(new AppError(404, 'Seller not found'));
  }

  res.status(200).json({
    status: 'success',
    data: seller,
  });
});

exports.deleteSeller = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOneAndDelete({ user: req.user._id });

  if (!seller) {
    return next(new AppError(404, 'Seller not found'));
  }

  req.user.isSeller = false;
  await req.user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});