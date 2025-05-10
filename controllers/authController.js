const nodemailer = require('nodemailer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  //const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  res.status(201).json({
    status: 'success',
    data: { user, token },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Email and password are required'));
  }

const user = await User.findOne({ email }).select('+password');
console.log('User from DB:', user);

if (!user || !(await bcrypt.compare(password, user.password))) {
  console.log('Password entered:', password);
  console.log('Hashed password from DB:', user?.password);
  return next(new AppError(401, 'Invalid email or password'));
}


  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(404, 'No user found with this email'));
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    status: 'success',
    message: 'Reset link sent to your email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError(400, 'Invalid or expired token'));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError(404, 'User not found'));
  }

  user.password = await bcrypt.hash(password, 12);
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return next(new AppError(400, 'Please provide name or email to update'));
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError(404, 'User not found'));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return next(new AppError(404, 'User not found'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});