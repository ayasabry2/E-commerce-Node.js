const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Product = require('../models/Product');
const Seller = require('../models/Seller');

exports.getProducts = catchAsync(async (req, res, next) => {
  const { search, seller } = req.query;
  let query = {};

  if (search) query.name = { $regex: search, $options: 'i' };
  if (seller) query.seller = seller;

  const products = await Product.find(query).populate('seller');

  if (!products || products.length === 0) {
    return next(new AppError(404, 'No products found'));
  }

  res.status(200).json({
    status: 'success',
    data: products,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, photo } = req.body;

  if (!name || !description || !photo) {
    return next(new AppError(400, 'Name, description, and photo are required'));
  }

  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) {
    return next(new AppError(403, 'Not a seller'));
  }

  const product = await Product.create({
    name,
    description,
    photo,
    seller: seller._id,
  });

  res.status(201).json({
    status: 'success',
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError(404, 'Product not found'));
  }

  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller || product.seller.toString() !== seller._id.toString()) {
    return next(new AppError(403, 'Not authorized to update this product'));
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError(404, 'Product not found'));
  }

  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller || product.seller.toString() !== seller._id.toString()) {
    return next(new AppError(403, 'Not authorized to delete this product'));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});