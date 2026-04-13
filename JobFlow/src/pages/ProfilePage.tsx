import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Stack,
  TextField, Button, Alert,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

// ── Avatar ────────────────────────────────────────────────────────────────────
const UserAvatar: React.FC<{ initial: string }> = ({ initial }) => (
  <Box
    sx={{
      width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
      background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 3px 10px rgba(45,82,224,0.30)',
    }}
  >
    <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#fff', lineHeight: 1 }}>
      {initial}
    </Typography>
  </Box>
);

// ── Section Card ──────────────────────────────────────────────────────────────
const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}> = ({ title, subtitle, icon, children, danger }) => (
  <Card
    sx={{
      border: danger ? '1px solid #FECACA' : '1px solid #EEECE8',
      bgcolor: danger ? '#FFFAFA' : '#fff',
    }}
  >
    <CardContent sx={{ p: { xs: 3, sm: 3.5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 3 }}>
        {icon && (
          <Box
            sx={{
              width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
              bgcolor: danger ? '#FEF2F2' : '#F0F4FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box sx={{ color: danger ? '#DC2626' : '#2D52E0', display: 'flex', fontSize: '1rem' }}>
              {icon}
            </Box>
          </Box>
        )}
        <Box>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: danger ? '#B91C1C' : '#0D0F17', lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: '0.8125rem', color: '#6B7180', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      {children}
    </CardContent>
  </Card>
);

// ── Profile Page ──────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { user, guestMode, signOut } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (password.length < 8) {
      setMsg({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await authService.updatePassword(password);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setPassword('');
      setConfirm('');
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initial = (user?.username?.[0] || user?.email?.[0] || '?').toUpperCase();

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 580 }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
          Profile &amp; Settings
        </Typography>
        <Typography sx={{ color: '#6B7180', fontSize: '0.9rem' }}>
          Manage your account and preferences
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {/* Account info */}
        <SectionCard title="Account" subtitle="Your profile information">
          <Stack direction="row" spacing={2} alignItems="center">
            <UserAvatar initial={initial} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D0F17', mb: 0.25 }}>
                {user?.username || user?.email}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#6B7180' }}>
                {user?.email}
              </Typography>
              {guestMode && (
                <Box
                  sx={{
                    display: 'inline-flex', alignItems: 'center',
                    mt: 0.75, px: 1, py: 0.35,
                    bgcolor: '#FFFBEB', border: '1px solid #FDE68A',
                    borderRadius: '6px',
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#92400E' }}>
                    Guest session
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </SectionCard>

        {/* Change password */}
        {!guestMode && (
          <SectionCard
            title="Change Password"
            subtitle="Update your login credentials"
            icon={<LockRoundedIcon sx={{ fontSize: 17 }} />}
          >
            {msg && (
              <Alert severity={msg.type} sx={{ mb: 2.5 }}>{msg.text}</Alert>
            )}
            <Box component="form" onSubmit={handlePasswordUpdate}>
              <Stack spacing={2.5}>
                <TextField
                  label="New password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Minimum 8 characters"
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  fullWidth
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<ShieldRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                  >
                    {loading ? 'Updating…' : 'Update password'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </SectionCard>
        )}

        {/* Sign Out */}
        <SectionCard
          title="Sign out"
          subtitle="Sign out of this device"
          icon={<LogoutRoundedIcon sx={{ fontSize: 17 }} />}
          danger
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutRoundedIcon sx={{ fontSize: '0.95rem !important' }} />}
            onClick={handleSignOut}
            sx={{
              borderColor: '#FECACA',
              color: '#B91C1C',
              '&:hover': {
                borderColor: '#DC2626',
                color: '#B91C1C',
                backgroundColor: '#FEF2F2',
              },
            }}
          >
            Sign out
          </Button>
        </SectionCard>
      </Stack>
    </Box>
  );
};

export default ProfilePage;