import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: String,
    image: {
      url: String,
      publicId: String
    },
    icon: String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
