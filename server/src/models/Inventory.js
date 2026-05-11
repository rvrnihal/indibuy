import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  warehouse: {
    name: String,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  stock: {
    quantity: { type: Number, required: true, default: 0 },
    reserved: { type: Number, default: 0 },
    available: Number,
    unit: String
  },
  
  reorderLevel: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 100 },
  
  pricing: {
    costPrice: Number,
    sellingPrice: Number,
    mrp: Number
  },
  
  expiryDate: Date,
  batchNumber: String,
  serialNumbers: [String],
  
  movements: [{
    type: {
      type: String,
      enum: ['inward', 'outward', 'transfer', 'adjustment', 'return']
    },
    quantity: Number,
    reference: String,
    reason: String,
    date: Date,
    operator: mongoose.Schema.Types.ObjectId
  }],
  
  lastCountedAt: Date,
  nextCountDueAt: Date,
  
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

inventorySchema.index({ product: 1, 'warehouse.name': 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ 'stock.quantity': 1 });

export default mongoose.model('Inventory', inventorySchema);
