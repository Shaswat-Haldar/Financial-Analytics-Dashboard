import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Avatar,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { Transaction } from '../types';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTransactions();
      setTransactions(response.data || []);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#10b981', text: 'white' };
      case 'pending':
        return { bg: '#f59e0b', text: 'white' };
      case 'failed':
        return { bg: '#ef4444', text: 'white' };
      case 'cancelled':
        return { bg: '#6b7280', text: 'white' };
      default:
        return { bg: '#334155', text: 'white' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shopping':
        return '🛍️';
      case 'food':
        return '🍽️';
      case 'transport':
        return '🚗';
      case 'entertainment':
        return '🎬';
      case 'health':
        return '🏥';
      case 'education':
        return '📚';
      case 'housing':
        return '🏠';
      case 'utilities':
        return '⚡';
      default:
        return '💰';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'rgba(99, 102, 241, 0.1)',
              fontSize: '14px',
            }}
          >
            {getCategoryIcon(params.row.category)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {params.row.category}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value >= 0 ? (
            <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
          ) : (
            <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: params.value >= 0 ? '#10b981' : '#ef4444',
            }}
          >
            {params.value >= 0 ? '+' : ''}${Math.abs(params.value).toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const statusColor = getStatusColor(params.value);
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              background: statusColor.bg,
              color: statusColor.text,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          />
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory = categoryFilter === 'all' || 
      transaction.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));
  const uniqueStatuses = Array.from(new Set(transactions.map(t => t.status)));

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      {/* Filters Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Status</MenuItem>
            {uniqueStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {uniqueCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
          size="small"
          sx={{
            borderColor: '#334155',
            color: 'text.primary',
            '&:hover': {
              borderColor: '#6366f1',
              background: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          Clear
        </Button>

        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 'auto' }}>
          {filteredTransactions.length} of {transactions.length} transactions
        </Typography>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={filteredTransactions}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
        sx={{
          background: 'transparent',
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #334155',
          },
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(99, 102, 241, 0.05)',
            borderBottom: '2px solid #334155',
          },
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #334155',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.05)',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #334155',
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default TransactionTable; 