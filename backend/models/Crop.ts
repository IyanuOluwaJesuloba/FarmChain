import mongoose, { Document, Schema } from 'mongoose';

export interface ICrop extends Document {
  farmerId: mongoose.Types.ObjectId;
  blockchainTxHash?: string;
  cropType: string;
  variety: string;
  plantingDate: Date;
  expectedHarvest: Date;
  actualHarvest?: Date;
  farmLocation: {
    state: string;
    lga: string;
    coordinates: [number, number];
    address?: string;
  };
  farmSize: number;
  status: 'planned' | 'planted' | 'growing' | 'mature' | 'harvested' | 'sold';
  qualityGrade?: 'premium' | 'grade-a' | 'grade-b' | 'grade-c';
  quantity?: number;
  unit?: string;
  notes?: string;
  images?: string[];
  ipfsHash?: string;
  isActive: boolean;
  statusUpdates: Array<{
    status: string;
    date: Date;
    notes?: string;
    updatedBy: mongoose.Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const cropSchema = new Schema<ICrop>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    blockchainTxHash: {
      type: String,
      match: /^0x[a-fA-F0-9]{64}$/,
    },
    cropType: {
      type: String,
      required: true,
      enum: [
        'Maize', 'Cassava', 'Rice', 'Yam', 'Millet', 'Sorghum', 
        'Cocoa', 'Oil Palm', 'Plantain', 'Banana', 'Tomatoes', 
        'Pepper', 'Onions', 'Okra', 'Groundnut', 'Cowpea', 
        'Sweet Potato', 'Irish Potato', 'Cotton', 'Sugarcane'
      ],
    },
    variety: {
      type: String,
      required: true,
      trim: true,
    },
    plantingDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date: Date) {
          return date <= new Date();
        },
        message: 'Planting date cannot be in the future',
      },
    },
    expectedHarvest: {
      type: Date,
      required: true,
      validate: {
        validator: function(date: Date) {
          return date > this.plantingDate;
        },
        message: 'Expected harvest must be after planting date',
      },
    },
    actualHarvest: {
      type: Date,
      validate: {
        validator: function(date: Date) {
          return !date || date >= this.plantingDate;
        },
        message: 'Actual harvest must be after planting date',
      },
    },
    farmLocation: {
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
      min: 0.01,
      max: 1000,
    },
    status: {
      type: String,
      enum: ['planned', 'planted', 'growing', 'mature', 'harvested', 'sold'],
      default: 'planned',
    },
    qualityGrade: {
      type: String,
      enum: ['premium', 'grade-a', 'grade-b', 'grade-c'],
    },
    quantity: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      enum: ['bags', 'tonnes', 'kg', 'tubers', 'bunches', 'pieces'],
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    images: [{
      type: String, // URLs to uploaded images
    }],
    ipfsHash: {
      type: String, // IPFS hash for additional documents
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    statusUpdates: [{
      status: {
        type: String,
        required: true,
        enum: ['planned', 'planted', 'growing', 'mature', 'harvested', 'sold'],
      },
      date: {
        type: Date,
        default: Date.now,
      },
      notes: String,
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
      },
    }],
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
cropSchema.index({ farmerId: 1 });
cropSchema.index({ cropType: 1 });
cropSchema.index({ status: 1 });
cropSchema.index({ 'farmLocation.state': 1 });
cropSchema.index({ plantingDate: -1 });
cropSchema.index({ expectedHarvest: 1 });
cropSchema.index({ isActive: 1 });
cropSchema.index({ blockchainTxHash: 1 });

// Instance methods
cropSchema.methods.updateStatus = function(newStatus: string, notes?: string, updatedBy?: mongoose.Types.ObjectId) {
  this.status = newStatus;
  this.statusUpdates.push({
    status: newStatus,
    date: new Date(),
    notes,
    updatedBy: updatedBy || this.farmerId,
  });
  
  if (newStatus === 'harvested' && !this.actualHarvest) {
    this.actualHarvest = new Date();
  }
  
  return this.save();
};

cropSchema.methods.recordHarvest = function(quantity: number, unit: string, qualityGrade?: string) {
  this.status = 'harvested';
  this.actualHarvest = new Date();
  this.quantity = quantity;
  this.unit = unit;
  if (qualityGrade) {
    this.qualityGrade = qualityGrade;
  }
  
  this.statusUpdates.push({
    status: 'harvested',
    date: new Date(),
    notes: `Harvested ${quantity} ${unit}`,
    updatedBy: this.farmerId,
  });
  
  return this.save();
};

cropSchema.methods.getDaysToHarvest = function() {
  const now = new Date();
  const expectedHarvest = new Date(this.expectedHarvest);
  const diffTime = expectedHarvest.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

cropSchema.methods.getGrowthProgress = function() {
  const now = new Date();
  const plantingDate = new Date(this.plantingDate);
  const expectedHarvest = new Date(this.expectedHarvest);
  
  const totalGrowthTime = expectedHarvest.getTime() - plantingDate.getTime();
  const elapsedTime = now.getTime() - plantingDate.getTime();
  
  const progress = Math.max(0, Math.min(100, (elapsedTime / totalGrowthTime) * 100));
  return Math.round(progress);
};

// Static methods
cropSchema.statics.findByFarmer = function(farmerId: mongoose.Types.ObjectId) {
  return this.find({ farmerId, isActive: true });
};

cropSchema.statics.findByStatus = function(status: string) {
  return this.find({ status, isActive: true });
};

cropSchema.statics.findByCropType = function(cropType: string) {
  return this.find({ cropType, isActive: true });
};

cropSchema.statics.findByLocation = function(state: string, lga?: string) {
  const query: any = { 'farmLocation.state': state, isActive: true };
  if (lga) {
    query['farmLocation.lga'] = lga;
  }
  return this.find(query);
};

cropSchema.statics.getCropsStats = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: null,
        totalCrops: { $sum: 1 },
        totalFarmSize: { $sum: '$farmSize' },
        statusBreakdown: {
          $push: {
            status: '$status',
            count: 1
          }
        },
        cropTypeBreakdown: {
          $push: {
            cropType: '$cropType',
            count: 1
          }
        },
        averageGrowthTime: {
          $avg: {
            $divide: [
              { $subtract: ['$expectedHarvest', '$plantingDate'] },
              86400000 // milliseconds in a day
            ]
          }
        }
      }
    }
  ]);
};

cropSchema.statics.searchCrops = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $and: [
      {
        $or: [
          { cropType: { $regex: query, $options: 'i' } },
          { variety: { $regex: query, $options: 'i' } },
          { 'farmLocation.state': { $regex: query, $options: 'i' } },
          { notes: { $regex: query, $options: 'i' } }
        ]
      },
      { isActive: true }
    ]
  };

  if (filters.farmerId) {
    searchQuery.$and.push({ farmerId: filters.farmerId });
  }

  if (filters.cropType) {
    searchQuery.$and.push({ cropType: filters.cropType });
  }

  if (filters.status) {
    searchQuery.$and.push({ status: filters.status });
  }

  if (filters.state) {
    searchQuery.$and.push({ 'farmLocation.state': filters.state });
  }

  if (filters.minFarmSize) {
    searchQuery.$and.push({ farmSize: { $gte: filters.minFarmSize } });
  }

  if (filters.plantingDateFrom) {
    searchQuery.$and.push({ plantingDate: { $gte: new Date(filters.plantingDateFrom) } });
  }

  if (filters.plantingDateTo) {
    searchQuery.$and.push({ plantingDate: { $lte: new Date(filters.plantingDateTo) } });
  }

  return this.find(searchQuery).populate('farmerId', 'name location.state verificationStatus');
};

cropSchema.statics.getHarvestableCredits = function() {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  return this.find({
    expectedHarvest: { $lte: thirtyDaysFromNow },
    status: { $in: ['growing', 'mature'] },
    isActive: true
  }).populate('farmerId', 'name walletAddress location.state');
};

export const Crop = mongoose.model<ICrop>('Crop', cropSchema);