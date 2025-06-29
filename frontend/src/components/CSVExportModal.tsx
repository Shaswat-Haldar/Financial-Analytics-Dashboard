import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { apiService } from '../services/api';
import { CSVExportRequest, TransactionFilters } from '../types';

interface CSVExportModalProps {
  open: boolean;
  onClose: () => void;
}

const AVAILABLE_COLUMNS = [
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'amount', label: 'Amount' },
  { id: 'type', label: 'Type' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Date' },
  { id: 'tags', label: 'Tags' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' }
];

const CSVExportModal: React.FC<CSVExportModalProps> = ({ open, onClose }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'title', 'amount', 'type', 'category', 'status', 'date'
  ]);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(AVAILABLE_COLUMNS.map(col => col.id));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleFilterChange = (field: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      setError('Please select at least one column to export');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const exportRequest: CSVExportRequest = {
        columns: selectedColumns,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        format: 'csv'
      };

      const blob = await apiService.exportTransactions(exportRequest);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error: any) {
      setError(error.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedColumns(['title', 'amount', 'type', 'category', 'status', 'date']);
    setFilters({});
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Export Transactions to CSV</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Select Columns
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button size="small" onClick={handleSelectAll} sx={{ mr: 1 }}>
            Select All
          </Button>
          <Button size="small" onClick={handleDeselectAll}>
            Deselect All
          </Button>
        </Box>

        <FormGroup row sx={{ mb: 3 }}>
          {AVAILABLE_COLUMNS.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={selectedColumns.includes(column.id)}
                  onChange={() => handleColumnToggle(column.id)}
                />
              }
              label={column.label}
              sx={{ width: '50%' }}
            />
          ))}
        </FormGroup>

        <Typography variant="h6" gutterBottom>
          Apply Filters (Optional)
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date) => handleFilterChange('startDate', date?.toISOString())}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) => handleFilterChange('endDate', date?.toISOString())}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type || ''}
              label="Type"
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Min Amount"
            type="number"
            size="small"
            value={filters.minAmount || ''}
            onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            sx={{ width: 120 }}
          />

          <TextField
            label="Max Amount"
            type="number"
            size="small"
            value={filters.maxAmount || ''}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            sx={{ width: 120 }}
          />
        </Box>

        <Typography variant="body2" color="textSecondary">
          Selected columns: {selectedColumns.length} of {AVAILABLE_COLUMNS.length}
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={loading || selectedColumns.length === 0}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Exporting...' : 'Export CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVExportModal; 