import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

// Verify Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Register User
export const registerUser = async (userData) => {
  try {
    const { email, password, firstName, lastName, phone, role } = userData;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }

    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'buyer'
    });

    await user.save();

    return {
      success: true,
      user: user.getProfile(),
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    };
  } catch (error) {
    throw error;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      success: true,
      user: user.getProfile(),
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    };
  } catch (error) {
    throw error;
  }
};

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).populate('addresses').populate('wallet.transactions');
    if (!user) {
      throw new Error('User not found');
    }
    return user.getProfile();
  } catch (error) {
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user.getProfile();
  } catch (error) {
    throw error;
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
