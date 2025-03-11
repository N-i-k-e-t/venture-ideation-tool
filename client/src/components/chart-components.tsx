import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Label
} from 'recharts';

// Color palette for charts
const colors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#8B5CF6',
  neutral: '#6B7280',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  chart: [
    '#3B82F6', // primary
    '#10B981', // secondary
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#6B7280', // gray
    '#EC4899', // pink
    '#06B6D4', // cyan
  ]
};

interface FinancialProjection {
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
}

interface CustomerAcquisitionData {
  month: number;
  customers: number;
}

interface ChannelData {
  name: string;
  effectiveness: number;
  costEfficiency: number;
  timeToResults: number;
}

// Market Size Chart (TAM, SAM, SOM)
export const MarketSizeChart = ({ tam, sam, som }: { tam?: string; sam?: string; som?: string }) => {
  // Extract numeric values from strings (assuming they're in format like "$100M")
  const extractNumericValue = (str?: string): number => {
    if (!str) return 0;
    
    const value = parseFloat(str.replace(/[^0-9.]/g, ''));
    
    // Handle suffixes like B, M, K
    if (str.includes('B') || str.includes('b')) return value * 1000;
    if (str.includes('M') || str.includes('m')) return value;
    if (str.includes('K') || str.includes('k')) return value / 1000;
    
    return value;
  };
  
  const tamValue = extractNumericValue(tam);
  const samValue = extractNumericValue(sam);
  const somValue = extractNumericValue(som);
  
  const data = [
    { name: 'TAM', value: tamValue, color: colors.chart[0] },
    { name: 'SAM', value: samValue, color: colors.chart[1] },
    { name: 'SOM', value: somValue, color: colors.chart[2] }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" 
          label={{ value: 'Market Size (in millions $)', position: 'insideBottom', offset: -5 }} 
        />
        <YAxis dataKey="name" type="category" />
        <Tooltip formatter={(value) => [`$${value}M`, 'Market Size']} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Competitive Analysis Chart - Radar chart showing your position vs competitors
export const CompetitiveAnalysisChart = ({ competitors }: { competitors?: any[] }) => {
  // Default data if none provided
  const data = competitors || [
    { subject: 'Feature Set', you: 80, competitor1: 90, competitor2: 70 },
    { subject: 'Price', you: 85, competitor1: 65, competitor2: 75 },
    { subject: 'UX Design', you: 90, competitor1: 85, competitor2: 65 },
    { subject: 'Performance', you: 75, competitor1: 80, competitor2: 70 },
    { subject: 'Market Reach', you: 65, competitor1: 95, competitor2: 80 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Your Product" dataKey="you" stroke={colors.primary} fill={colors.primary} fillOpacity={0.6} />
        <Radar name="Competitor 1" dataKey="competitor1" stroke={colors.tertiary} fill={colors.tertiary} fillOpacity={0.6} />
        <Radar name="Competitor 2" dataKey="competitor2" stroke={colors.neutral} fill={colors.neutral} fillOpacity={0.6} />
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Revenue Projection Chart
export const RevenueProjectionChart = ({ projections }: { projections: FinancialProjection[] }) => {
  // Format the data to handle missing values
  const data = projections.map(p => ({
    year: `Year ${p.year}`,
    revenue: p.revenue || 0,
    expenses: p.expenses || 0,
    profit: p.profit || 0
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis 
          label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
          tickFormatter={(value) => `$${value/1000}K`}
        />
        <Tooltip formatter={(value) => [`$${value}`, '']} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke={colors.primary} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="expenses" stroke={colors.danger} />
        <Line type="monotone" dataKey="profit" stroke={colors.success} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Break-Even Chart
export const BreakEvenChart = ({ fixedCosts, variableCost, price }: { fixedCosts: number; variableCost: number; price: number }) => {
  // Generate data points for break-even analysis
  const generateBreakEvenData = () => {
    const data = [];
    const breakEvenPoint = fixedCosts / (price - variableCost);
    const maxUnits = Math.ceil(breakEvenPoint * 1.5);
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      data.push({
        units,
        totalCosts: fixedCosts + variableCost * units,
        totalRevenue: price * units,
      });
    }
    
    return data;
  };
  
  const data = generateBreakEvenData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="units" 
          label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }} 
        />
        <YAxis 
          label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
          tickFormatter={(value) => `$${value/1000}K`}
        />
        <Tooltip formatter={(value) => [`$${value}`, '']} />
        <Legend />
        <Line type="monotone" dataKey="totalCosts" name="Total Costs" stroke={colors.danger} />
        <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke={colors.success} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Customer Acquisition Chart
export const CustomerAcquisitionChart = ({ data }: { data: CustomerAcquisitionData[] }) => {
  // Format the data
  const formattedData = data.map(d => ({
    month: `Month ${d.month}`,
    customers: d.customers
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="customers" 
          name="Customers" 
          stroke={colors.primary} 
          activeDot={{ r: 8 }} 
        />
        <Legend />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Channel Comparison Chart
export const ChannelComparisonChart = ({ channels }: { channels: ChannelData[] }) => {
  // Format the data for radar chart
  const formatChannelData = () => {
    const metrics = ['effectiveness', 'costEfficiency', 'timeToResults'];
    const result = [];
    
    metrics.forEach(metric => {
      const obj: any = { metric: metric.charAt(0).toUpperCase() + metric.slice(1) };
      channels.forEach(channel => {
        obj[channel.name] = channel[metric as keyof ChannelData];
      });
      result.push(obj);
    });
    
    return result;
  };
  
  const data = formatChannelData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />
        <YAxis />
        <Tooltip />
        <Legend />
        {channels.map((channel, index) => (
          <Bar key={channel.name} dataKey={channel.name} fill={colors.chart[index % colors.chart.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Helper component for rendering bar charts
const BarChart = ({ data, layout = "vertical" }: { data: any[]; layout?: "vertical" | "horizontal" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {layout === "vertical" ? (
          <>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
          </>
        ) : (
          <>
            <XAxis dataKey="name" />
            <YAxis />
          </>
        )}
        <Tooltip />
        <Bar dataKey="value" fill={colors.primary} radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || colors.chart[index % colors.chart.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
