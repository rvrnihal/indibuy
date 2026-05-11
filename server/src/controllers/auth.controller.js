import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateTokens = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  return { token, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, companyName } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'buyer',
      companyName
    });

    const { token, refreshToken } = generateTokens(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const { token, refreshToken } = generateTokens(user._id, user.role);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, profileImage },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};
