import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h4" 
              color="primary" 
              fontWeight="800"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Login Account
            </Typography>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your task dashboard
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form id="login-form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                      sx={{ color: '#6366f1' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                boxShadow: '0 3px 5px 2px rgba(99, 102, 241, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                  boxShadow: '0 3px 10px 2px rgba(99, 102, 241, .5)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#cbd5e1',
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <Box 
                    component="span" 
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 16,
                        height: 16,
                        border: '2px solid',
                        borderColor: 'white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    Signing in...
                  </Box>
                </>
              ) : 'Sign In'}
            </Button>

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                my: 3 
              }}
            >
              <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
              <Typography 
                variant="body2" 
                sx={{ px: 2, color: 'text.secondary' }}
              >
                OR
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
            </Box>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Don't have an account?
              </Typography>
              <Link
                to="/register"
                style={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '2px solid #e0e7ff',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8fafc',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e0e7ff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create new account
                <Box
                  component="span"
                  sx={{
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    transition: 'transform 0.2s',
                  }}
                >
                  →
                </Box>
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;