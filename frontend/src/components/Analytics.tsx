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
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  FilterList,
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
  AreaChart,
  Area,
} from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Sample data for analytics
  const monthlyData = [
    { month: 'Jan', income: 4500, expenses: 3200, savings: 1300, investments: 800 },
    { month: 'Feb', income: 4800, expenses: 3400, savings: 1400, investments: 900 },
    { month: 'Mar', income: 5200, expenses: 3100, savings: 2100, investments: 1200 },
    { month: 'Apr', income: 4900, expenses: 3600, savings: 1300, investments: 1000 },
    { month: 'May', income: 5500, expenses: 3300, savings: 2200, investments: 1400 },
    { month: 'Jun', income: 5100, expenses: 3500, savings: 1600, investments: 1100 },
  ];

  const categoryData = [
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

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Analytics 📊
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'text.secondary' }}>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                color: 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#334155',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366f1',
                },
              }}
            >
              <MenuItem value="1month">1 Month</MenuItem>
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
              <MenuItem value="1year">1 Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Deep dive into your financial patterns and insights.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Spending"
            value="$21,200"
            change={-8.2}
            icon={<TrendingDown />}
            color="#ef4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Income"
            value="$30,600"
            change={12.5}
            icon={<TrendingUp />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Savings"
            value="$9,400"
            change={15.8}
            icon={<AccountBalance />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Investment Growth"
            value="$6,500"
            change={22.3}
            icon={<TrendingUp />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Income vs Expenses Trend */}
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
                  Income vs Expenses Trend
                </Typography>
                <Chip
                  label="6 months"
                  size="small"
                  sx={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
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
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Spending Categories */}
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
                Spending Categories
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
                  <Box key={category.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        background: `${category.color}20`,
                        color: category.color,
                        fontSize: '0.75rem',
                      }}
                    >
                      {category.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {category.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Savings vs Investment Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                  Savings vs Investment Growth
                </Typography>
                <Chip
                  label="Compound Growth"
                  size="small"
                  sx={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
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
                  <Bar dataKey="savings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="investments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 