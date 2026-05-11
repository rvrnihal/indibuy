import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  
  sales: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageOrderValue: Number,
    totalItems: { type: Number, default: 0 },
    conversionRate: Number,
    paymentMethods: {
      creditCard: Number,
      debitCard: Number,
      upi: Number,
      netbanking: Number,
      wallet: Number,
      cod: Number
    }
  },
  
  users: {
    newUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    returningUsers: { type: Number, default: 0 },
    usersByRole: {
      buyers: Number,
      vendors: Number,
      admins: Number
    }
  },
  
  products: {
    totalProducts: Number,
    activeProducts: Number,
    topSellingProducts: [{ productId: mongoose.Schema.Types.ObjectId, sales: Number }],
    lowStockProducts: [mongoose.Schema.Types.ObjectId]
  },
  
  vendors: {
    totalVendors: Number,
    activeVendors: Number,
    newVendors: Number,
    topVendors: [{ vendorId: mongoose.Schema.Types.ObjectId, revenue: Number }]
  },
  
  traffic: {
    totalVisits: Number,
    pageViews: Number,
    uniqueVisitors: Number,
    bounceRate: Number,
    averageSessionTime: Number,
    deviceBreakdown: {
      mobile: Number,
      desktop: Number,
      tablet: Number
    }
  },
  
  geography: {
    topCities: [{ city: String, count: Number }],
    topStates: [{ state: String, count: Number }],
    topCountries: [{ country: String, count: Number }]
  },
  
  category: {
    topCategories: [{ categoryId: mongoose.Schema.Types.ObjectId, sales: Number }]
  },
  
  customer: {
    satisfaction: Number,
    averageRating: Number,
    reviewCount: Number,
    returnsRate: Number,
    refundRate: Number
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

analyticsSchema.index({ type: 1, 'period.startDate': 1 });
analyticsSchema.index({ 'period.startDate': -1 });

export default mongoose.model('Analytics', analyticsSchema);
