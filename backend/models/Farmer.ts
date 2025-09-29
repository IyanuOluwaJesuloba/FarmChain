import mongoose, { Document, Schema } from 'mongoose';

export interface IFarmer extends Document {
  walletAddress: string;
  phoneNumber: string;
  name: string;
  email?: string;
  location: {
    state: string;
    lga: string;
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  farmSize: number;
  crops: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  profileImage?: string;
  isActive: boolean;
  reputationScore: number;
  totalSales: number;
  totalEarnings: number;
  joinedAt: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new Schema<IFarmer>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^\+234[0-9]{10}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    location: {
      state: {
        type: String,
        required: true,
        enum: [
          'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 
          'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 
          'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 
          'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
          'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 
          'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
        ],
      },
      lga: {
        type: String,
        required: true,
        trim: true,
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function(coordinates: number[]) {
            return coordinates.length === 2 && 
                   coordinates[0] >= -180 && coordinates[0] <= 180 && 
                   coordinates[1] >= -90 && coordinates[1] <= 90;
          },
          message: 'Invalid coordinates',
        },
      },
      address: {
        type: String,
        trim: true,
      },
    },
    farmSize: {
      type: Number,
      required: true,
      min: 0.1,
      max: 10000,
    },
    crops: [{
      type: String,
      enum: [
        'Maize', 'Cassava', 'Rice', 'Yam', 'Millet', 'Sorghum', 
        'Cocoa', 'Oil Palm', 'Plantain', 'Banana', 'Tomatoes', 
        'Pepper', 'Onions', 'Okra', 'Groundnut', 'Cowpea', 
        'Sweet Potato', 'Irish Potato', 'Cotton', 'Sugarcane'
      ],
    }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDocuments: [{
      type: String, // URLs to uploaded documents
    }],
    profileImage: {
      type: String, // URL to uploaded image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reputationScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 1000,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
farmerSchema.index({ walletAddress: 1 });
farmerSchema.index({ phoneNumber: 1 });
farmerSchema.index({ 'location.state': 1 });
farmerSchema.index({ verificationStatus: 1 });
farmerSchema.index({ isActive: 1 });
farmerSchema.index({ reputationScore: -1 });

// Instance methods
farmerSchema.methods.updateReputationScore = function(change: number) {
  this.reputationScore = Math.max(0, Math.min(1000, this.reputationScore + change));
  return this.save();
};

farmerSchema.methods.addSale = function(amount: number) {
  this.totalSales += 1;
  this.totalEarnings += amount;
  return this.save();
};

farmerSchema.methods.toPublicJSON = function() {
  const farmer = this.toObject();
  delete farmer.phoneNumber;
  delete farmer.email;
  delete farmer.verificationDocuments;
  return farmer;
};

// Static methods
farmerSchema.statics.findByWalletAddress = function(walletAddress: string) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

farmerSchema.statics.findVerifiedFarmers = function(state?: string) {
  const query: any = { verificationStatus: 'verified', isActive: true };
  if (state) {
    query['location.state'] = state;
  }
  return this.find(query);
};

farmerSchema.statics.getFarmersStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalFarmers: { $sum: 1 },
        verifiedFarmers: {
          $sum: {
            $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0]
          }
        },
        pendingVerification: {
          $sum: {
            $cond: [{ $eq: ['$verificationStatus', 'pending'] }, 1, 0]
          }
        },
        totalFarmSize: { $sum: '$farmSize' },
        totalEarnings: { $sum: '$totalEarnings' },
        averageReputationScore: { $avg: '$reputationScore' }
      }
    }
  ]);
};

farmerSchema.statics.searchFarmers = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $and: [
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { crops: { $in: [new RegExp(query, 'i')] } },
          { 'location.state': { $regex: query, $options: 'i' } }
        ]
      },
      { isActive: true }
    ]
  };

  if (filters.state) {
    searchQuery.$and.push({ 'location.state': filters.state });
  }

  if (filters.verificationStatus) {
    searchQuery.$and.push({ verificationStatus: filters.verificationStatus });
  }

  if (filters.crops && filters.crops.length > 0) {
    searchQuery.$and.push({ crops: { $in: filters.crops } });
  }

  if (filters.minReputationScore) {
    searchQuery.$and.push({ reputationScore: { $gte: filters.minReputationScore } });
  }

  return this.find(searchQuery);
};

// Pre-save middleware
farmerSchema.pre('save', function(next) {
  if (this.isModified('walletAddress')) {
    this.walletAddress = this.walletAddress.toLowerCase();
  }
  next();
});

export const Farmer = mongoose.model<IFarmer>('Farmer', farmerSchema);