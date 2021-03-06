import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { pointSchema } from '../geolocation/PointSchema.js';

export const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  swap: {
    type: Boolean,
    required: true,
  },
  donate: {
    type: Boolean,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  card: {
    type: String,
  },
  amount: {
    type: Number,
  },
  tags: {
    type: [String],
  },
  location: {
    type: pointSchema,
    required: true,
  },
}, {
  timestamps: true,
});

PlantSchema.index({ location: '2dsphere' });

PlantSchema.index({
  name: 'text',
  tags: 'text',
  description: 'text',
});

PlantSchema.plugin(mongoosePaginate);
