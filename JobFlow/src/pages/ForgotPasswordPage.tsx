import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Link, Alert, Stack,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useAuth } from '@/context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FAFAF8',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: '-5%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,82,224,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: '#fff',
          border: '1px solid #EEECE8',
          borderRadius: 4,
          p: { xs: 4, sm: 5 },
          boxShadow: '0 4px 24px rgba(13,15,23,0.07), 0 1px 4px rgba(13,15,23,0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link
          component={RouterLink}
          to="/login"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 4,
            color: '#6B7180',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'color 0.15s ease',
            '&:hover': { color: '#0D0F17' },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
          Back to sign in
        </Link>

        {sent ? (
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 60, height: 60, borderRadius: '14px',
                background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem',
              }}
            >
              ✉️
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}>
                Email sent!
              </Typography>
              <Typography sx={{ color: '#6B7180', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                We sent a reset link to{' '}
                <Box component="span" sx={{ fontWeight: 600, color: '#0D0F17' }}>{email}</Box>.
                Check your inbox and follow the instructions.
              </Typography>
            </Box>
            <Alert
              severity="success"
              sx={{ width: '100%', textAlign: 'left' }}
            >
              Reset link sent! If you don&apos;t see it, check your spam folder.
            </Alert>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              size="large"
            >
              Back to sign in
            </Button>
          </Stack>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: '12px', mb: 3,
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <EmailRoundedIcon sx={{ color: '#2D52E0', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', mb: 0.75 }}>
                Reset your password
              </Typography>
              <Typography sx={{ color: '#6B7180', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ display: 'flex', mr: 1, color: '#9CA3AF' }}>
                        <EmailRoundedIcon sx={{ fontSize: 18 }} />
                      </Box>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={!loading && <SendRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;