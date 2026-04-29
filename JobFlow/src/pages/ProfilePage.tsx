import React, { useRef, useState } from 'react';
import { Lock, LogOut, Camera, Trash2, Loader2 } from 'lucide-react';
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
    e.target.value = '';
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative w-13 h-13 rounded-xl shrink-0 overflow-hidden cursor-pointer`}
      style={{ boxShadow: '0 3px 10px rgba(45,82,224,0.30)' }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover block" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)' }}>
          <span className="text-xl font-extrabold text-white" style={{ fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{initial}</span>
        </div>
      )}

      {editable && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: '14px' }}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </div>
      )}

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleChange}
        />
      )}
    </div>
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
  <div className={`rounded-xl border p-6 ${danger ? 'border-red-200 bg-red-50/50' : 'border-[#EEECE8] bg-white'}`}>
    <div className="flex items-start gap-3 mb-5">
      {icon && (
        <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 ${danger ? 'bg-red-100' : 'bg-blue-50'}`}>
          <span className={danger ? 'text-red-600' : 'text-[var(--color-primary)]'}>{icon}</span>
        </div>
      )}
      <div>
        <h3 className={`text-sm font-bold ${danger ? 'text-red-800' : 'text-[#0D0F17]'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
        {subtitle && <p className="text-xs text-[#6B7180] mt-1">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

// ── Profile Page ──────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { user, guestMode, signOut, avatarUrl, uploadAvatar, deleteAccount, updateUsername } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [username, setUsername] = useState(user?.username ?? '');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameMsg({ type: 'error', text: 'Username cannot be empty' });
      return;
    }
    if (trimmed === (user?.username ?? '')) {
      setUsernameMsg({ type: 'error', text: 'That is already your username' });
      return;
    }
    setUsernameLoading(true);
    setUsernameMsg(null);
    try {
      await updateUsername(trimmed);
      setUsernameMsg({ type: 'success', text: 'Username updated!' });
    } catch (err) {
      setUsernameMsg({ type: 'error', text: err instanceof Error ? err.message : 'Update failed' });
    } finally {
      setUsernameLoading(false);
    }
  };

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
    const maxBytes = 5 * 1024 * 1024;
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
    <div className="p-4 md:p-8 max-w-[580px]">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-[#0D0F17] mb-1" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
          Profile &amp; Settings
        </h2>
        <p className="text-sm text-[#6B7180]">Manage your account and preferences</p>
      </div>

      <div className="space-y-5">
        {/* Account info */}
        <SectionCard title="Account" subtitle="Your profile information">
          {avatarMsg && (
            <div className={`mb-5 p-3 rounded-lg text-sm ${avatarMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {avatarMsg.text}
            </div>
          )}
          <div className="flex items-center gap-4">
            <UserAvatar
              initial={initial}
              avatarUrl={avatarUrl}
              editable={!guestMode}
              onFileSelected={handleAvatarSelected}
              uploading={avatarUploading}
            />
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#0D0F17] mb-0.5">{user?.username || user?.email}</p>
              <p className="text-xs text-[#6B7180]">{user?.email}</p>
              {guestMode ? (
                <span className="inline-flex items-center mt-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">
                  <span className="text-xs font-semibold text-amber-700">Guest session</span>
                </span>
              ) : (
                <p className="text-xs text-[#9CA3AF] mt-2">Click your photo to change it</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Change username – signed-in users only */}
        {!guestMode && (
          <SectionCard
            title="Username"
            subtitle="Update your display name"
            icon={<Lock size={17} />}
          >
            {usernameMsg && (
              <div className={`mb-5 p-3 rounded-lg text-sm ${usernameMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {usernameMsg.text}
              </div>
            )}
            <form onSubmit={handleUsernameUpdate}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">New username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Enter a new username"
                  />
                </div>
                <button
                  type="submit"
                  disabled={usernameLoading}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {usernameLoading ? 'Saving…' : 'Save username'}
                </button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Change password – signed-in users only */}
        {!guestMode && (
          <SectionCard
            title="Change Password"
            subtitle="Update your login credentials"
            icon={<Lock size={17} />}
          >
            {msg && (
              <div className={`mb-5 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {msg.text}
              </div>
            )}
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Sign Out / Exit Guest */}
        <SectionCard
          title={guestMode ? "Guest session" : "Sign out"}
          subtitle={guestMode ? "End temporary session" : "Sign out of this device"}
          icon={<LogOut size={17} />}
          danger
        >
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            {guestMode ? "Exit guest session" : "Sign out"}
          </button>
        </SectionCard>

        {/* Delete Account – Signed-in users only */}
        {!guestMode && (
          <SectionCard
            title="Delete Account"
            subtitle="Permanently remove your account and all data"
            icon={<Trash2 size={17} />}
            danger
          >
            {deleteMsg && (
              <div className={`mb-5 p-3 rounded-lg text-sm ${deleteMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {deleteMsg.text}
              </div>
            )}
            <p className="text-xs text-[#6B7180] mb-4">
              This action is <strong>irreversible.</strong> Type your email address below to confirm.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={`Type "${user?.email}" to confirm`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoComplete="off"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirm !== (user?.email ?? '')}
                className="px-4 py-2 border border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleteLoading ? 'Deleting…' : 'Delete my account'}
              </button>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;