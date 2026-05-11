import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  description: String,
  image: String,
  icon: String,
  
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  subcategories: [String],
  
  attributes: [{
    name: String,
    values: [String]
  }],
  
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  commission: { type: Number, default: 5 },
  
  isActive: { type: Boolean, default: true },
  
  metadata: {
    productCount: { type: Number, default: 0 },
    displayOrder: Number,
    featured: Boolean
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Category', categorySchema);
