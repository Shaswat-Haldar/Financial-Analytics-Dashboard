import mongoose, { Document, Schema } from 'mongoose';
import { Transaction } from '../types';

export interface TransactionDocument extends Transaction, Document {}

const transactionSchema = new Schema<TransactionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'paid',
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, status: 1 });

// Text index for search functionality
transactionSchema.index({
  description: 'text',
  category: 'text'
});

export const TransactionModel = mongoose.model<TransactionDocument>('Transaction', transactionSchema); 