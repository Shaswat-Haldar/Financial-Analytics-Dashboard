import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
  Home,
  Movie,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import TransactionTable from './TransactionTable';
import CSVExportModal from './CSVExportModal';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  transactionsCount: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    transactionsCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 4500, expenses: 3200, savings: 1300 },
    { month: 'Feb', income: 4800, expenses: 3400, savings: 1400 },
    { month: 'Mar', income: 5200, expenses: 3100, savings: 2100 },
    { month: 'Apr', income: 4900, expenses: 3600, savings: 1300 },
    { month: 'May', income: 5500, expenses: 3300, savings: 2200 },
    { month: 'Jun', income: 5100, expenses: 3500, savings: 1600 },
  ];

  const categoryData: CategoryData[] = [
    { name: 'Shopping', value: 35, color: '#6366f1', icon: <ShoppingCart /> },
    { name: 'Food', value: 25, color: '#ec4899', icon: <Restaurant /> },
    { name: 'Transport', value: 15, color: '#f59e0b', icon: <LocalGasStation /> },
    { name: 'Housing', value: 20, color: '#10b981', icon: <Home /> },
    { name: 'Entertainment', value: 5, color: '#3b82f6', icon: <Movie /> },
  ];

  const pieData = categoryData.map(cat => ({
    name: cat.name,
    value: cat.value,
    color: cat.color,
  }));

  useEffect(() => {
    // Calculate stats from transactions
    const calculateStats = () => {
      // This would normally come from your API
      setStats({
        totalBalance: 12500,
        monthlyIncome: 5100,
        monthlyExpenses: 3500,
        savingsRate: 31.4,
        transactionsCount: 156,
      });
    };

    calculateStats();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
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
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {change >= 0 ? (
            <ArrowUpward sx={{ color: '#10b981', fontSize: 16 }} />
          ) : (
            <ArrowDownward sx={{ color: '#ef4444', fontSize: 16 }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: change >= 0 ? '#10b981' : '#ef4444',
              fontWeight: 600,
            }}
          >
            {Math.abs(change)}% from last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const CategoryCard: React.FC<{ category: CategoryData }> = ({ category }) => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '1px solid #334155',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: `${category.color}20`,
              color: category.color,
            }}
          >
            {category.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {category.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {category.value}% of total
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={category.value}
          sx={{
            height: 6,
            borderRadius: 3,
            background: '#334155',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${category.color} 0%, ${category.color}80 100%)`,
              borderRadius: 3,
            },
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.firstName?.split(' ')[0] || 'User'}! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here's what's happening with your finances today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Balance"
            value="$12,500"
            change={8.2}
            icon={<AccountBalance />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Income"
            value="$5,100"
            change={12.5}
            icon={<TrendingUp />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Expenses"
            value="$3,500"
            change={-5.2}
            icon={<TrendingDown />}
            color="#ef4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Savings Rate"
            value="31.4%"
            change={15.8}
            icon={<TrendingUp />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Overview Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #334155',
              height: 400,
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Monthly Overview
                </Typography>
                <Chip
                  label="Last 6 months"
                  size="small"
                  sx={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#cbd5e1"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#cbd5e1"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Categories */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid #334155',
              height: 400,
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Expense Categories
              </Typography>
              <ResponsiveContainer width="100%" height="60%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {categoryData.map((category) => (
                  <CategoryCard key={category.name} category={category} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid #334155',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <Tooltip title="Export to CSV">
              <IconButton
                onClick={() => setShowExportModal(true)}
                sx={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <TrendingUp />
              </IconButton>
            </Tooltip>
          </Box>
          <TransactionTable />
        </CardContent>
      </Card>

      <CSVExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </Box>
  );
};

export default Dashboard; 