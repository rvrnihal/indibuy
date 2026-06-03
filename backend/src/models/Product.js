import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      maxlength: 500
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory'
    },
    brand: {
      type: String,
      trim: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    price: {
      original: {
        type: Number,
        required: true
      },
      discounted: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    gst: {
      rate: {
        type: Number,
        default: 18
      },
      amount: Number
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      },
      breakdown: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 }
      }
    },
    images: [
      {
        url: String,
        publicId: String,
        alt: String
      }
    ],
    thumbnail: {
      url: String,
      publicId: String
    },
    specifications: {
      material: String,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: String
      },
      weight: {
        value: Number,
        unit: String
      },
      color: String,
      specifications: [{
        key: String,
        value: String
      }]
    },
    stock: {
      quantity: {
        type: Number,
        default: 0
      },
      sku: {
        type: String,
        unique: true,
        sparse: true
      },
      lowStockThreshold: Number,
      trackInventory: {
        type: Boolean,
        default: true
      }
    },
    warranty: {
      period: Number,
      unit: String,
      description: String
    },
    shipping: {
      weight: Number,
      dimensions: String,
      handlingTime: Number,
      shippingCost: Number,
      freeShipping: Boolean
    },
    documents: [
      {
        type: String,
        name: String,
        url: String
      }
    ],
    videos: [String],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'discontinued'],
      default: 'active'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0
    },
    tags: [String],
    moq: {
      type: Number,
      default: 1
    },
    bulkPricing: [
      {
        minQuantity: Number,
        maxQuantity: Number,
        price: Number
      }
    ]
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ vendor: 1, status: 1 });

export default mongoose.model('Product', productSchema);
