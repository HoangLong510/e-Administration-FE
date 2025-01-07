import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Mock data for demonstration
const mockReports = [
  { id: 1, title: 'System Error #123', reporter: 'John Doe', date: '2024-12-27', priority: 'High', status: 'Pending' },
  { id: 2, title: 'Login Issue #456', reporter: 'Jane Smith', date: '2024-12-26', priority: 'Medium', status: 'Processing' },
  { id: 3, title: 'Database Optimization', reporter: 'Alice Johnson', date: '2024-12-25', priority: 'Low', status: 'Completed' },
  { id: 4, title: 'Security Patch #789', reporter: 'Bob Williams', date: '2024-12-24', priority: 'High', status: 'Completed' },
  { id: 5, title: 'UI Enhancement', reporter: 'Charlie Brown', date: '2024-12-23', priority: 'Medium', status: 'Pending' },
  { id: 6, title: 'Performance Issue #101', reporter: 'Diana Prince', date: '2024-12-22', priority: 'High', status: 'Processing' },
];

const TasksReport = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleView = (reportId) => {
    // Replace this with the code to navigate to the detailed page of the report
    console.log(`View details for report ${reportId}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredReports = useMemo(() => {
    switch (selectedCategory) {
      case 'weekly':
        return mockReports;
      case 'processed':
        return mockReports.filter(report => report.status === 'Completed');
      case 'inProgress':
        return mockReports.filter(report => report.status === 'Processing');
      case 'priority':
        return mockReports.filter(report => report.priority === 'High');
      default:
        return mockReports;
    }
  }, [selectedCategory]);

  const StatCard = ({ title, value, icon, category }) => (
    <Card 
      sx={{ cursor: 'pointer' }} 
      onClick={() => handleCategoryClick(category)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {category === selectedCategory ? 'Currently viewing' : 'Click to view'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Weekly Reports"
            value={mockReports.length}
            icon={<AssignmentIcon color="primary" sx={{ mr: 1 }} />}
            category="weekly"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Processed"
            value={mockReports.filter(r => r.status === 'Completed').length}
            icon={<CheckCircleIcon color="success" sx={{ mr: 1 }} />}
            category="processed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={mockReports.filter(r => r.status === 'Processing').length}
            icon={<PendingIcon color="warning" sx={{ mr: 1 }} />}
            category="inProgress"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Priority"
            value={mockReports.filter(r => r.priority === 'High').length}
            icon={<PriorityHighIcon color="error" sx={{ mr: 1 }} />}
            category="priority"
          />
        </Grid>
      </Grid>

      {/* Reports List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>#{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.reporter}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.priority}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleView(report.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TasksReport;
