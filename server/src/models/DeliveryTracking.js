import mongoose from 'mongoose';

const deliveryTrackingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  shipment: {
    trackingNumber: { type: String, required: true, unique: true },
    carrier: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'processing',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'failed_attempt',
        'returned',
        'cancelled'
      ],
      default: 'processing'
    }
  },
  
  deliveryPartner: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    vehicle: String,
    rating: Number
  },
  
  pickupLocation: {
    name: String,
    address: String,
    city: String,
    phone: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  deliveryLocation: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  timeline: [{
    status: String,
    timestamp: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    notes: String
  }],
  
  estimates: {
    pickupDate: Date,
    deliveryDate: Date,
    deliveryWindow: {
      startTime: String,
      endTime: String
    }
  },
  
  actual: {
    pickedUpAt: Date,
    deliveredAt: Date,
    failureReason: String,
    failureCount: { type: Number, default: 0 }
  },
  
  otp: {
    code: String,
    attempts: { type: Number, default: 0 },
    verified: Boolean,
    verifiedAt: Date
  },
  
  signature: {
    recipientName: String,
    signatureImage: String,
    photo: String
  },
  
  issues: [{
    type: String,
    description: String,
    resolution: String,
    reportedAt: Date
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

deliveryTrackingSchema.index({ 'shipment.trackingNumber': 1 });
deliveryTrackingSchema.index({ order: 1 });
deliveryTrackingSchema.index({ 'shipment.status': 1 });

export default mongoose.model('DeliveryTracking', deliveryTrackingSchema);
