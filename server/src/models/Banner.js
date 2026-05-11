import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  
  description: String,
  
  image: {
    type: String,
    required: true
  },
  
  link: String,
  linkType: {
    type: String,
    enum: ['category', 'product', 'vendor', 'external', 'none']
  },
  
  type: {
    type: String,
    enum: ['hero', 'promotional', 'seasonal', 'flash_deal', 'category', 'vendor'],
    default: 'promotional'
  },
  
  placement: {
    type: String,
    enum: ['homepage_top', 'homepage_middle', 'homepage_bottom', 'category_page', 'search_page'],
    default: 'homepage_top'
  },
  
  displayOrder: { type: Number, default: 0 },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  schedule: {
    startDate: Date,
    endDate: Date,
    isScheduled: Boolean
  },
  
  visibility: {
    userTypes: [String],
    deviceTypes: ['mobile', 'tablet', 'desktop'],
    geoTargeting: [String]
  },
  
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: Number
  },
  
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

bannerSchema.index({ status: 1, placement: 1, displayOrder: 1 });
bannerSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

export default mongoose.model('Banner', bannerSchema);
