import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
  exportTransactions,
  validateTransaction
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Transaction CRUD operations
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', validateTransaction, createTransaction);
router.put('/:id', validateTransaction, updateTransaction);
router.delete('/:id', deleteTransaction);

// Export functionality
router.post('/export', exportTransactions);

export default router; 