import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, Link,
  Alert, Stack, Divider, InputAdornment,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import { useAuth } from '@/context/AuthContext';

const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', bgcolor: '#F8FAFC', p: 2,
        }}
      >
        <Card sx={{ maxWidth: 440, width: '100%', p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>📬</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Check your email</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </Typography>
          <Button component={RouterLink} to="/login" variant="contained" fullWidth>
            Back to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: 2,
        background: 'radial-gradient(ellipse at 40% 0%, #F5F3FF 0%, #F8FAFC 60%)',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          onClick={() => navigate('/')}
          sx={{ mb: 4, cursor: 'pointer', px: 1, py: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
        >
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <WorkRoundedIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            JobFlow
          </Typography>
        </Stack>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Create your account</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Start tracking your job search today</Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Email address" type="email" fullWidth required
              value={email} onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password" type="password" fullWidth required
              value={password} onChange={(e) => setPassword(e.target.value)}
              helperText="Minimum 8 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password" type="password" fullWidth required
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }} />
        <Typography align="center" color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600}>Sign in</Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default RegisterPage;