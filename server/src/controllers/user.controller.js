import User from '../models/User.js';
import Address from '../models/Address.js';
import Wishlist from '../models/Wishlist.js';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

// Get User Profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, bio, avatar } = req.body;

    const allowedFields = { firstName, lastName, phone, bio, avatar };
    Object.keys(allowedFields).forEach(
      key => allowedFields[key] === undefined && delete allowedFields[key]
    );

    if (Object.keys(allowedFields).length === 0) {
      throw new AppError('No fields to update', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedFields,
      { new: true }
    ).select('-password -refreshToken');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppError('All password fields are required', 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    const user = await User.findById(req.user._id);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Old password is incorrect', 401);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add Address
export const addAddress = async (req, res, next) => {
  try {
    const { type, street, city, state, pincode, country, phone, isDefault } = req.body;

    if (!street || !city || !state || !pincode || !country) {
      throw new AppError('All address fields are required', 400);
    }

    const address = new Address({
      user: req.user._id,
      type,
      street,
      city,
      state,
      pincode,
      country,
      phone,
      isDefault
    });

    await address.save();

    // If this is the default address, update other addresses
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Get Addresses
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

// Update Address
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { type, street, city, state, pincode, country, phone, isDefault } = req.body;

    const address = await Address.findById(addressId);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (address.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (type) address.type = type;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (country) address.country = country;
    if (phone) address.phone = phone;

    if (isDefault !== undefined) {
      address.isDefault = isDefault;
      if (isDefault) {
        await Address.updateMany(
          { user: req.user._id, _id: { $ne: addressId } },
          { isDefault: false }
        );
      }
    }

    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Delete Address
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findById(addressId);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (address.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    await Address.findByIdAndDelete(addressId);

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add to Wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [productId]
      });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.json({
      success: true,
      message: 'Added to wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.json({
      success: true,
      message: 'Removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Get Wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      return res.json({
        success: true,
        data: { user: req.user._id, products: [] }
      });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Clear Wishlist
export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Update KYC Details
export const updateKYC = async (req, res, next) => {
  try {
    const { aadharNumber, panNumber, gstNumber, bankDetails } = req.body;

    const kyc = {};
    if (aadharNumber) kyc['kyc.aadharNumber'] = aadharNumber;
    if (panNumber) kyc['kyc.panNumber'] = panNumber;
    if (gstNumber) kyc['kyc.gstNumber'] = gstNumber;
    if (bankDetails) kyc['kyc.bankDetails'] = bankDetails;

    if (Object.keys(kyc).length === 0) {
      throw new AppError('No KYC fields to update', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      kyc,
      { new: true }
    ).select('-password -refreshToken');

    res.json({
      success: true,
      message: 'KYC details updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Get User Statistics
export const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        totalOrders: user.orders?.length || 0,
        totalSpent: user.totalSpent || 0,
        walletBalance: user.wallet?.balance || 0,
        referralCode: user.referralCode,
        referralsCount: user.referrals?.length || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Preferences
export const getPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user.preferences || {}
    });
  } catch (error) {
    next(error);
  }
};

// Update Preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const preferences = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    ).select('-password -refreshToken');

    res.json({
      success: true,
      message: 'Preferences updated',
      data: user.preferences
    });
  } catch (error) {
    next(error);
  }
};
