import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Menu,
  MenuItem as MuiMenuItem,
  Tooltip,
  Badge,
  Avatar,
  Paper,
  InputAdornment,
  Divider,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  RadioButtonUnchecked as TodoIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Task as TaskIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Task form state
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
  });

  useEffect(() => {
    fetchTasks();
    checkDueDateNotifications();
  }, [page, statusFilter, priorityFilter, search, sortBy, sortOrder]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: search || undefined,
        sortBy,
        sortOrder,
      };
      
      const response = await axios.get('http://localhost:5000/api/tasks', { params });
      setTasks(response.data.tasks);
      setTotalTasks(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const checkDueDateNotifications = () => {
    const today = new Date();
    const upcomingTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = parseISO(task.dueDate);
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1 && diffDays >= 0;
    });

    const notificationList = upcomingTasks.map(task => ({
      id: task._id,
      title: task.title,
      dueDate: task.dueDate,
      message: isToday(parseISO(task.dueDate)) 
        ? 'is due today!' 
        : 'is due tomorrow!',
    }));

    setNotifications(notificationList);
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task._id);
      setTaskData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? parseISO(task.dueDate) : null,
      });
    } else {
      setEditingTask(null);
      setTaskData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...taskData,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
      };

      if (editingTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTask}`, data);
        toast.success('Task updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/tasks', data);
        toast.success('Task created successfully');
      }

      fetchTasks();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <TodoIcon />;
      case 'in-progress': return <PlayCircleIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <TodoIcon />;
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = parseISO(dateString);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue: ${format(date, 'MMM dd')}`;
    
    return format(date, 'MMM dd, yyyy');
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return '#6b7280';
    const date = parseISO(dateString);
    
    if (isPast(date)) return '#ef4444';
    if (isToday(date)) return '#f59e0b';
    if (isTomorrow(date)) return '#3b82f6';
    
    return '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return { label: 'High', color: '#fee2e2', textColor: '#dc2626' };
      case 'medium': return { label: 'Medium', color: '#fef3c7', textColor: '#d97706' };
      case 'low': return { label: 'Low', color: '#d1fae5', textColor: '#059669' };
      default: return { label: 'Medium', color: '#f3f4f6', textColor: '#6b7280' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo': return { label: 'To Do', color: '#fef3c7', textColor: '#d97706' };
      case 'in-progress': return { label: 'In Progress', color: '#dbeafe', textColor: '#1d4ed8' };
      case 'completed': return { label: 'Completed', color: '#d1fae5', textColor: '#059669' };
      default: return { label: 'To Do', color: '#f3f4f6', textColor: '#6b7280' };
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ field, label }) => (
    <Button
      size="small"
      onClick={() => handleSort(field)}
      startIcon={sortBy === field ? (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : <SortIcon />}
      sx={{
        color: sortBy === field ? '#6366f1' : '#6b7280',
        bgcolor: sortBy === field ? alpha('#6366f1', 0.1) : 'transparent',
        '&:hover': {
          bgcolor: alpha('#6366f1', 0.2),
        },
        borderRadius: 2,
        textTransform: 'none',
        fontSize: '0.875rem',
      }}
    >
      {label}
    </Button>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Modern App Bar */}
      <AppBar 
        position="sticky"
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <TaskIcon sx={{ color: 'white' }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AYKAYS TASK MANAGEMENT
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh">
              <IconButton 
                onClick={fetchTasks}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Box sx={{ position: 'relative' }}>
              <Button
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                  px: 2,
                  py: 1,
                  gap: 1,
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    }
                  }
                }}
              >
                <MuiMenuItem disabled>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Signed in as
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.email}
                    </Typography>
                  </Box>
                </MuiMenuItem>
                <Divider />
                <MuiMenuItem onClick={logout}>
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  Logout
                </MuiMenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        pt: { xs: 2, sm: 3 },
        pb: 6,
      }}>
        <Container maxWidth="xl">
          {/* Welcome Header */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Welcome back, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Manage your tasks efficiently with our intuitive dashboard. Stay organized and boost your productivity.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                title: 'Total Tasks', 
                value: totalTasks, 
                icon: <DashboardIcon />, 
                color: '#6366f1',
                trend: '+12%'
              },
              { 
                title: 'To Do', 
                value: tasks.filter(t => t.status === 'todo').length, 
                icon: <TodoIcon />, 
                color: '#f59e0b',
                trend: '+5%'
              },
              { 
                title: 'In Progress', 
                value: tasks.filter(t => t.status === 'in-progress').length, 
                icon: <PlayCircleIcon />, 
                color: '#3b82f6',
                trend: '+8%'
              },
              { 
                title: 'Completed', 
                value: tasks.filter(t => t.status === 'completed').length, 
                icon: <CheckCircleIcon />, 
                color: '#10b981',
                trend: '+15%'
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Fade in={!loading} timeout={index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.1)',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.5)} 100%)`,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '14px',
                          background: alpha(stat.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Chip
                        label={stat.trend}
                        size="small"
                        sx={{
                          bgcolor: alpha('#10b981', 0.1),
                          color: '#059669',
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                        icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                      />
                    </Box>
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Main Content Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              background: 'white',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              mb: 4,
            }}
          >
            {/* Header with Controls */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="h6" fontWeight={700}>
                      Your Tasks
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <SortButton field="createdAt" label="Recent" />
                      <SortButton field="dueDate" label="Due Date" />
                      <SortButton field="priority" label="Priority" />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      New Task
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Filters and Search */}
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Priority</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterIcon />}
                      onClick={() => {
                        setStatusFilter('all');
                        setPriorityFilter('all');
                        setSearch('');
                      }}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Tasks Grid */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                  <Box textAlign="center">
                    <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1', mb: 3 }} />
                    <Typography color="text.secondary">
                      Loading your tasks...
                    </Typography>
                  </Box>
                </Box>
              ) : tasks.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <TaskIcon sx={{ fontSize: 60, color: '#9ca3af' }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    No tasks found
                  </Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                    {search || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Try changing your search or filters'
                      : 'Create your first task to get started!'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
                  >
                    Create Your First Task
                  </Button>
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {tasks.map((task, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={task._id}>
                        <Zoom in={!loading} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Paper
                            elevation={0}
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.3s',
                              borderRadius: 3,
                              border: '1px solid',
                              borderColor: 'divider',
                              overflow: 'hidden',
                              position: 'relative',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                borderColor: alpha('#6366f1', 0.3),
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${getPriorityColor(task.priority)} 0%, ${alpha(getPriorityColor(task.priority), 0.5)} 100%)`,
                              }
                            }}
                          >
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ flex: 1, mr: 2 }}>
                                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3 }}>
                                    {task.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    <Chip
                                      label={getStatusBadge(task.status).label}
                                      size="small"
                                      sx={{
                                        bgcolor: getStatusBadge(task.status).color,
                                        color: getStatusBadge(task.status).textColor,
                                        fontWeight: 600,
                                        borderRadius: 1.5,
                                        height: 24,
                                      }}
                                    />
                                    <Chip
                                      label={getPriorityBadge(task.priority).label}
                                      size="small"
                                      sx={{
                                        bgcolor: getPriorityBadge(task.priority).color,
                                        color: getPriorityBadge(task.priority).textColor,
                                        fontWeight: 600,
                                        borderRadius: 1.5,
                                        height: 24,
                                      }}
                                    />
                                  </Box>
                                </Box>
                                <Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(task)}
                                    sx={{ 
                                      color: '#6b7280',
                                      '&:hover': { color: '#6366f1', bgcolor: alpha('#6366f1', 0.1) }
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 3,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.6,
                                }}
                              >
                                {task.description || 'No description provided'}
                              </Typography>
                              
                              <Box sx={{ mt: 'auto' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarIcon sx={{ fontSize: 16, color: getDueDateColor(task.dueDate) }} />
                                    <Typography 
                                      variant="caption" 
                                      fontWeight={600}
                                      sx={{ color: getDueDateColor(task.dueDate) }}
                                    >
                                      {formatDueDate(task.dueDate)}
                                    </Typography>
                                  </Box>
                                  
                                  <Select
                                    size="small"
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    sx={{ 
                                      minWidth: 120,
                                      borderRadius: 2,
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'divider',
                                      }
                                    }}
                                  >
                                    <MenuItem value="todo">To Do</MenuItem>
                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                  </Select>
                                </Box>
                              </Box>
                            </CardContent>
                            
                            <Divider />
                            
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Created {format(parseISO(task.createdAt), 'MMM dd')}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(task._id)}
                                sx={{ 
                                  color: '#ef4444',
                                  '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={4}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            borderRadius: 2,
                            '&.Mui-selected': {
                              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                              color: 'white',
                              fontWeight: 600,
                            }
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Task Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          pb: 1,
          background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Task Title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              fullWidth
              required
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            
            <TextField
              label="Description"
              placeholder="Describe your task..."
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={taskData.status}
                    label="Status"
                    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                    sx={{ 
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6366f1',
                      },
                    }}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={taskData.priority}
                    label="Priority"
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                    sx={{ 
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6366f1',
                      },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <DatePicker
              label="Due Date"
              value={taskData.dueDate}
              onChange={(date) => setTaskData({ ...taskData, dueDate: date })}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  sx: { 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#6366f1',
                      },
                    }
                  }
                } 
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!taskData.title}
            sx={{ 
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default Dashboard;