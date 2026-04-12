import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Link,
  Alert, Stack, InputAdornment, IconButton,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useAuth } from '@/context/AuthContext';

// ── Brand Panel (left side) ───────────────────────────────────────────────────
const BrandPanel: React.FC = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '45%',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0D0F17 0%, #161829 60%, #1E1535 100%)',
      p: 5,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    {/* Decorative orb */}
    <Box sx={{
      position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 360, height: 360, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />
    <Box sx={{
      position: 'absolute', bottom: '15%', right: '-10%',
      width: 280, height: 280, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(45,82,224,0.14) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />

    {/* Logo */}
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          width: 34, height: 34, borderRadius: '9px',
          background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(45,82,224,0.40)',
        }}
      >
        <Box component="span" sx={{ color: '#fff', fontFamily: '"Sora",sans-serif', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1 }}>J</Box>
      </Box>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.02em' }}>
        JobFlow
      </Typography>
    </Stack>

    {/* Main copy */}
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography
        sx={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 800,
          fontSize: '2.25rem',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#fff',
          mb: 2,
        }}
      >
        Your next role
        <br />
        <Box
          component="span"
          sx={{
            background: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          starts here.
        </Box>
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: 300 }}>
        Track every application, nail every interview, and land the job you deserve.
      </Typography>
    </Box>

    {/* Social proof */}
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Stack direction="row" spacing={-0.75} sx={{ mb: 1.5 }}>
        {['#818CF8', '#C084FC', '#60A5FA', '#34D399'].map((c, i) => (
          <Box
            key={i}
            sx={{
              width: 28, height: 28, borderRadius: '50%',
              bgcolor: c, border: '2px solid #0D0F17',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          />
        ))}
      </Stack>
      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>
        Join hundreds of job seekers already using JobFlow
      </Typography>
    </Box>
  </Box>
);

// ── Login Page ────────────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BrandPanel />

      {/* Form Side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#FAFAF8',
          p: { xs: 3, sm: 5, md: 6 },
          position: 'relative',
        }}
      >
        {/* Mobile logo */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          onClick={() => navigate('/')}
          sx={{
            display: { xs: 'flex', md: 'none' },
            cursor: 'pointer',
            mb: 5,
          }}
        >
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box component="span" sx={{ color: '#fff', fontFamily: '"Sora",sans-serif', fontWeight: 800, fontSize: '0.875rem', lineHeight: 1 }}>J</Box>
          </Box>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0D0F17', letterSpacing: '-0.02em' }}>
            JobFlow
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.03em', mb: 0.75 }}
            >
              Welcome back
            </Typography>
            <Typography sx={{ color: '#6B7180', fontSize: '0.9375rem' }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: '10px', fontSize: '0.875rem' }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Box>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          size="small"
                          sx={{ color: '#9CA3AF', '&:hover': { color: '#6B7180' } }}
                        >
                          {showPassword
                            ? <VisibilityOff sx={{ fontSize: 18 }} />
                            : <Visibility sx={{ fontSize: 18 }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#2D52E0',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowForwardRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{ mt: 0.5 }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid #EEECE8',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#6B7180', fontSize: '0.875rem' }}>
              Don&apos;t have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ fontWeight: 700, color: '#2D52E0', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Create one free
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;