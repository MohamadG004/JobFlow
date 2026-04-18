import React, { useRef, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Stack,
  TextField, Button, Alert, CircularProgress, Tooltip,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

// ── Avatar ────────────────────────────────────────────────────────────────────
interface UserAvatarProps {
  initial: string;
  avatarUrl: string | null;
  editable?: boolean;
  onFileSelected?: (file: File) => void;
  uploading?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  initial, avatarUrl, editable = false, onFileSelected, uploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable && !uploading) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected?.(file);
    // Reset so the same file can be re-selected after an error
    e.target.value = '';
  };

  return (
    <Tooltip title={editable ? 'Change photo' : ''} placement="bottom" disableHoverListener={!editable}>
      <Box
        onClick={handleClick}
        sx={{
          position: 'relative',
          width: 52, height: 52,
          borderRadius: '14px',
          flexShrink: 0,
          cursor: editable ? 'pointer' : 'default',
          overflow: 'hidden',
          boxShadow: '0 3px 10px rgba(45,82,224,0.30)',
          '&:hover .avatar-overlay': editable ? { opacity: 1 } : {},
        }}
      >
        {/* Base: image or gradient initial */}
        {avatarUrl ? (
          <Box
            component="img"
            src={avatarUrl}
            alt="Profile"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#fff', lineHeight: 1 }}>
              {initial}
            </Typography>
          </Box>
        )}

        {/* Hover / uploading overlay */}
        {editable && (
          <Box
            className="avatar-overlay"
            sx={{
              position: 'absolute', inset: 0,
              bgcolor: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: uploading ? 1 : 0,
              transition: 'opacity 0.18s',
              borderRadius: '14px',
            }}
          >
            {uploading
              ? <CircularProgress size={20} thickness={5} sx={{ color: '#fff' }} />
              : <CameraAltRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
          </Box>
        )}

        {/* Hidden file input */}
        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleChange}
          />
        )}
      </Box>
    </Tooltip>
  );
};

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
  const { user, guestMode, signOut, avatarUrl, uploadAvatar, deleteAccount } = useAuth();
  const navigate = useNavigate();

  // ── Password state
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Avatar state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleAvatarSelected = async (file: File) => {
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxBytes) {
      setAvatarMsg({ type: 'error', text: 'Image must be smaller than 5 MB' });
      return;
    }
    setAvatarUploading(true);
    setAvatarMsg(null);
    try {
      await uploadAvatar(file);
      setAvatarMsg({ type: 'success', text: 'Profile photo updated!' });
    } catch (err) {
      setAvatarMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    // Guard is also enforced by the disabled prop on the button,
    // but we double-check here for safety.
    if (deleteConfirm !== (user?.email ?? '')) {
      setDeleteMsg({ type: 'error', text: 'Email does not match' });
      return;
    }
    setDeleteLoading(true);
    setDeleteMsg(null);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      setDeleteMsg({ type: 'error', text: err instanceof Error ? err.message : 'Deletion failed' });
      setDeleteLoading(false);
    }
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
          {avatarMsg && (
            <Alert severity={avatarMsg.type} sx={{ mb: 2.5 }} onClose={() => setAvatarMsg(null)}>
              {avatarMsg.text}
            </Alert>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <UserAvatar
              initial={initial}
              avatarUrl={avatarUrl}
              editable={!guestMode}
              onFileSelected={handleAvatarSelected}
              uploading={avatarUploading}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0D0F17', mb: 0.25 }}>
                {user?.username || user?.email}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#6B7180' }}>
                {user?.email}
              </Typography>
              {guestMode ? (
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
              ) : (
                <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF', mt: 0.5 }}>
                  Click your photo to change it
                </Typography>
              )}
            </Box>
          </Stack>
        </SectionCard>

        {/* Change password – signed-in users only */}
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

        {/* Delete Account – Signed-in users only */}
        {!guestMode && (
          <SectionCard
            title="Delete Account"
            subtitle="Permanently remove your account and all data"
            icon={<DeleteIcon sx={{ fontSize: 17 }} />}
            danger
          >
            {deleteMsg && (
              <Alert severity={deleteMsg.type} sx={{ mb: 2.5 }} onClose={() => setDeleteMsg(null)}>
                {deleteMsg.text}
              </Alert>
            )}
            <Typography sx={{ fontSize: '0.8125rem', color: '#6B7180', mb: 2 }}>
              This action is <strong>irreversible.</strong> Type your email
              address below to confirm.
            </Typography>
            <Stack spacing={2}>
              <TextField
                label={`Type "${user?.email}" to confirm`}
                fullWidth
                size="small"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                autoComplete="off"
                inputProps={{ 'data-lpignore': 'true', 'data-form-type': 'other' }}
              />
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={deleteLoading || deleteConfirm !== (user?.email ?? '')}
                  onClick={handleDeleteAccount}
                  sx={{
                    borderColor: '#FECACA',
                    color: '#B91C1C',
                    '&:hover': {
                      borderColor: '#DC2626',
                      color: '#B91C1C',
                      backgroundColor: '#FEF2F2',
                    },
                    '&.Mui-disabled': {
                      borderColor: '#FECACA',
                      color: '#FCA5A5',
                    },
                  }}
                >
                  {deleteLoading ? 'Deleting…' : 'Delete my account'}
                </Button>
              </Box>
            </Stack>
          </SectionCard>
        )}
      </Stack>
    </Box>
  );
};

export default ProfilePage;