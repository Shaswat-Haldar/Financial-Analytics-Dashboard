import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createObjectCsvWriter } from 'csv-writer';
import { TransactionModel } from '../models/Transaction';
import { Transaction, TransactionFilters, PaginationOptions, PaginatedResponse, ApiResponse, DashboardStats, CSVExportRequest } from '../types';

// Import AuthRequest from auth middleware
interface AuthRequest extends Request {
  user?: any;
}

// Get all transactions with filtering and pagination
export const getTransactions = async (req: AuthRequest, res: Response<PaginatedResponse<Transaction>>) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      startDate,
      endDate,
      minAmount,
      maxAmount,
      category,
      status,
      type,
      search
    } = req.query;

    const filters: any = { userId: req.user._id };

    // Date range filter
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate as string);
      if (endDate) filters.date.$lte = new Date(endDate as string);
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      filters.amount = {};
      if (minAmount) filters.amount.$gte = Number(minAmount);
      if (maxAmount) filters.amount.$lte = Number(maxAmount);
    }

    // Other filters
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Search filter
    if (search) {
      filters.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 };

    const [transactions, total] = await Promise.all([
      TransactionModel.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      TransactionModel.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    });
  }
};

// Get single transaction
export const getTransaction = async (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Create new transaction
export const createTransaction = async (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const transaction = new TransactionModel({
      ...req.body,
      userId: req.user._id
    });

    await transaction.save();

    return res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update transaction
export const updateTransaction = async (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const transaction = await TransactionModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    return res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delete transaction
export const deleteTransaction = async (req: AuthRequest, res: Response<ApiResponse<null>>) => {
  try {
    const transaction = await TransactionModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    return res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response<ApiResponse<DashboardStats>>) => {
  try {
    const userId = req.user._id;

    // Get total revenue and expenses
    const revenueResult = await TransactionModel.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expensesResult = await TransactionModel.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const totalExpenses = expensesResult[0]?.total || 0;
    const netIncome = totalRevenue - totalExpenses;

    // Get transaction count
    const transactionCount = await TransactionModel.countDocuments({ userId });

    // Get category breakdown
    const categoryBreakdown = await TransactionModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', amount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { amount: -1 } },
      { $limit: 10 }
    ]);

    // Get monthly trends for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await TransactionModel.aggregate([
      { $match: { userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const stats: DashboardStats = {
      totalRevenue,
      totalExpenses,
      netIncome,
      transactionCount,
      categoryBreakdown: categoryBreakdown.map(item => ({
        category: item._id,
        amount: item.amount,
        count: item.count
      })),
      monthlyTrends: monthlyTrends.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        revenue: item.revenue,
        expenses: item.expenses
      }))
    };

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Export transactions to CSV
export const exportTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { columns, filters } = req.body;

    const queryFilters: any = { userId: req.user._id };

    // Apply filters if provided
    if (filters) {
      if (filters.startDate || filters.endDate) {
        queryFilters.date = {};
        if (filters.startDate) queryFilters.date.$gte = new Date(filters.startDate);
        if (filters.endDate) queryFilters.date.$lte = new Date(filters.endDate);
      }
      if (filters.category) queryFilters.category = filters.category;
      if (filters.status) queryFilters.status = filters.status;
      if (filters.type) queryFilters.type = filters.type;
    }

    const transactions = await TransactionModel.find(queryFilters).lean();

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: 'transactions.csv',
      header: columns.map((col: string) => ({ id: col, title: col.charAt(0).toUpperCase() + col.slice(1) }))
    });

    // Write data to CSV
    await csvWriter.writeRecords(transactions);

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');

    // Send file
    res.download('transactions.csv', (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Validation middleware
export const validateTransaction = [
  body('description').notEmpty().withMessage('Description is required'),
  body('amount').isFloat().withMessage('Amount must be a valid number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['paid', 'pending']).withMessage('Invalid status'),
  body('date').isISO8601().withMessage('Invalid date format')
]; 