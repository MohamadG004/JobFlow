import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Link,
  Alert, Stack, InputAdornment,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useAuth } from '@/context/AuthContext';

// ── Brand Panel ───────────────────────────────────────────────────────────────
const BrandPanel: React.FC = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '42%',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0D0F17 0%, #161829 60%, #1E1535 100%)',
      p: 5,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    <Box sx={{
      position: 'absolute', top: '20%', right: '-15%',
      width: 400, height: 400, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(45,82,224,0.16) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />
    <Box sx={{
      position: 'absolute', bottom: '25%', left: '-10%',
      width: 300, height: 300, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
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

    {/* Copy */}
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography
        sx={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 800,
          fontSize: '2.1rem',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#fff',
          mb: 2.5,
        }}
      >
        One place for
        <br />
        <Box component="span" sx={{ background: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          every application.
        </Box>
      </Typography>

      <Stack spacing={1.75}>
        {[
          'Drag-and-drop kanban board',
          'Track interviews & offers',
          'Analytics dashboard',
          'Free forever, no credit card',
        ].map((item) => (
          <Stack key={item} direction="row" spacing={1.25} alignItems="center">
            <CheckCircleRoundedIcon sx={{ color: '#818CF8', fontSize: 18, flexShrink: 0 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>{item}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>

    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8125rem', position: 'relative', zIndex: 1 }}>
      Already have an account?{' '}
      <Link component={RouterLink} to="/login" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#fff' } }}>
        Sign in
      </Link>
    </Typography>
  </Box>
);

// ── Register Page ─────────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, username);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FAFAF8', p: 3 }}>
        <Box
          sx={{
            maxWidth: 420, width: '100%', textAlign: 'center',
            bgcolor: '#fff', border: '1px solid #EEECE8', borderRadius: 4,
            p: { xs: 4, sm: 5 },
            boxShadow: '0 8px 32px rgba(13,15,23,0.08)',
          }}
        >
          <Box
            sx={{
              width: 64, height: 64, borderRadius: '16px', mx: 'auto', mb: 3,
              background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            📬
          </Box>
          <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}>
            Check your inbox
          </Typography>
          <Typography sx={{ color: '#6B7180', mb: 3.5, lineHeight: 1.65 }}>
            We sent a confirmation link to{' '}
            <Box component="span" sx={{ fontWeight: 600, color: '#0D0F17' }}>{email}</Box>.
            Click it to activate your account.
          </Typography>
          <Button component={RouterLink} to="/login" variant="contained" fullWidth size="large">
            Back to sign in
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BrandPanel />

      {/* Form side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#FAFAF8',
          p: { xs: 3, sm: 5, md: 6 },
          overflowY: 'auto',
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
          <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          </Box>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0D0F17', letterSpacing: '-0.02em' }}>
            JobFlow
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.03em', mb: 0.75 }}>
              Create your account
            </Typography>
            <Typography sx={{ color: '#6B7180', fontSize: '0.9375rem' }}>
              Start tracking your job search today. It&apos;s free!
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Username"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                helperText="At least 3 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                }}
              />
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
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 8 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm password"
                type="password"
                fullWidth
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowForwardRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{ mt: 0.5 }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #EEECE8', textAlign: 'center' }}>
            <Typography sx={{ color: '#6B7180', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ fontWeight: 700, color: '#2D52E0', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;