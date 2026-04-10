import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, TextField, Button, Typography, Link, Alert, Stack,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
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
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', bgcolor: '#F8FAFC', p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
        <Link
          component={RouterLink} to="/login"
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.5, mb: 3,
            color: 'text.secondary', textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowBackRoundedIcon fontSize="small" /> Back to login
        </Link>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Reset password</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we&apos;ll send you a reset link.
        </Typography>

        {sent ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Reset link sent! Check your inbox.
          </Alert>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email address" type="email" fullWidth required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;