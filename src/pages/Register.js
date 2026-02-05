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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
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
         
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.98)',
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
              Create Account
            </Typography>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Join TaskFlow Pro
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account to start managing tasks
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
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
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
                background: 'linear-gradient(45deg, #10b981 30%, #34d399 90%)',
                boxShadow: '0 3px 5px 2px rgba(16, 185, 129, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669 30%, #10b981 90%)',
                  boxShadow: '0 3px 10px 2px rgba(16, 185, 129, .5)',
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
                    Creating account...
                  </Box>
                </>
              ) : 'Sign Up'}
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
                Already have an account?
              </Typography>
              <Link
                to="/login"
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
                Sign in to existing account
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

export default Register;