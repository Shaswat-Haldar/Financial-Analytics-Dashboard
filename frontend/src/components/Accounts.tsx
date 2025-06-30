import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Savings,
  TrendingUp as InvestmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  accountNumber: string;
  isVisible: boolean;
  lastTransaction: string;
  change: number;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 5420.50,
      currency: 'USD',
      accountNumber: '****1234',
      isVisible: true,
      lastTransaction: '2024-01-15',
      change: 2.3,
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 12500.00,
      currency: 'USD',
      accountNumber: '****5678',
      isVisible: true,
      lastTransaction: '2024-01-14',
      change: 1.8,
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.75,
      currency: 'USD',
      accountNumber: '****9012',
      isVisible: true,
      lastTransaction: '2024-01-15',
      change: -5.2,
    },
    {
      id: '4',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 45680.25,
      currency: 'USD',
      accountNumber: '****3456',
      isVisible: true,
      lastTransaction: '2024-01-15',
      change: 8.7,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    currency: 'USD',
    accountNumber: '',
  });

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <AccountBalance />;
      case 'savings':
        return <Savings />;
      case 'credit':
        return <CreditCard />;
      case 'investment':
        return <InvestmentIcon />;
      default:
        return <AccountBalance />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking':
        return '#6366f1';
      case 'savings':
        return '#10b981';
      case 'credit':
        return '#ef4444';
      case 'investment':
        return '#f59e0b';
      default:
        return '#6366f1';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Checking';
      case 'savings':
        return 'Savings';
      case 'credit':
        return 'Credit Card';
      case 'investment':
        return 'Investment';
      default:
        return 'Account';
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD',
      accountNumber: '',
    });
    setOpenDialog(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency,
      accountNumber: account.accountNumber,
    });
    setOpenDialog(true);
  };

  const handleSaveAccount = () => {
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData, balance: parseFloat(formData.balance), type: formData.type as 'checking' | 'savings' | 'credit' | 'investment' }
          : acc
      ));
    } else {
      // Add new account
      const newAccount: Account = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type as 'checking' | 'savings' | 'credit' | 'investment',
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        accountNumber: formData.accountNumber,
        isVisible: true,
        lastTransaction: new Date().toISOString().split('T')[0],
        change: 0,
      };
      setAccounts([...accounts, newAccount]);
    }
    setOpenDialog(false);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const toggleAccountVisibility = (accountId: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { ...acc, isVisible: !acc.isVisible }
        : acc
    ));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Accounts 💳
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAccount}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              },
            }}
          >
            Add Account
          </Button>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your financial accounts and track balances across all your accounts.
        </Typography>
      </Box>

      {/* Total Balance Card */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid #334155',
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: totalBalance >= 0 ? '#10b981' : '#ef4444' }}>
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
              }}
            >
              <AccountBalance sx={{ fontSize: 32 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} lg={4} key={account.id}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${getAccountColor(account.type)} 0%, ${getAccountColor(account.type)}80 100%)`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: `${getAccountColor(account.type)}20`,
                        color: getAccountColor(account.type),
                      }}
                    >
                      {getAccountIcon(account.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {account.name}
                      </Typography>
                      <Chip
                        label={getAccountTypeLabel(account.type)}
                        size="small"
                        sx={{
                          background: `${getAccountColor(account.type)}20`,
                          color: getAccountColor(account.type),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleAccountVisibility(account.id)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {account.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditAccount(account)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAccount(account.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: account.balance >= 0 ? '#10b981' : '#ef4444' }}>
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {account.accountNumber}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {account.change >= 0 ? (
                      <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: account.change >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                      }}
                    >
                      {account.change >= 0 ? '+' : ''}{account.change}%
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Last: {account.lastTransaction}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Account Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
          {editingAccount ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Account Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={formData.type}
                label="Account Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="checking">Checking</MenuItem>
                <MenuItem value="savings">Savings</MenuItem>
                <MenuItem value="credit">Credit Card</MenuItem>
                <MenuItem value="investment">Investment</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Account Number (Last 4 digits)"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveAccount}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              },
            }}
          >
            {editingAccount ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts; 