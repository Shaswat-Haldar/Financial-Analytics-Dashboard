import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  Transaction, 
  TransactionFilters, 
  PaginatedResponse, 
  DashboardStats,
  CSVExportRequest,
  ApiResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/login', data);
    return response.data.data!;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/register', data);
    return response.data.data!;
  }

  async getProfile(): Promise<any> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/auth/profile');
    return response.data.data;
  }

  // Transaction endpoints
  async getTransactions(params?: TransactionFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<PaginatedResponse<Transaction>> {
    const response: AxiosResponse<PaginatedResponse<Transaction>> = await this.api.get('/transactions', { params });
    return response.data;
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response: AxiosResponse<ApiResponse<Transaction>> = await this.api.get(`/transactions/${id}`);
    return response.data.data!;
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const response: AxiosResponse<ApiResponse<Transaction>> = await this.api.post('/transactions', data);
    return response.data.data!;
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const response: AxiosResponse<ApiResponse<Transaction>> = await this.api.put(`/transactions/${id}`, data);
    return response.data.data!;
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.api.delete(`/transactions/${id}`);
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await this.api.get('/transactions/stats');
    return response.data.data!;
  }

  // Export endpoint
  async exportTransactions(data: CSVExportRequest): Promise<Blob> {
    const response = await this.api.post('/transactions/export', data, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiService = new ApiService();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const requestPasswordReset = (email: string) =>
  axios.post(`${API_URL}/auth/forgot-password`, { email });

export const resetPassword = (email: string, token: string, newPassword: string) =>
  axios.post(`${API_URL}/auth/reset-password`, { email, token, newPassword }); 
 