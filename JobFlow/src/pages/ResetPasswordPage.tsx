import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabase';

const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [validLink, setValidLink] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 🔥 Handle Supabase recovery session
  useEffect(() => {
    const handleRecovery = async () => {
      try {
        const hash = window.location.hash;

        if (hash.includes('access_token')) {
          const params = new URLSearchParams(hash.substring(1));

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              throw error;
            }

            // ✅ Clean URL after success
            window.history.replaceState({}, document.title, '/reset-password');
          }
        }

        // ✅ Verify session exists
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          setValidLink(false);
        }
      } catch {
        setValidLink(false);
      } finally {
        setCheckingSession(false);
      }
    };

    handleRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    if (password !== confirm) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '-5%',
          right: '-5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '-10%',
          left: '-5%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(45,82,224,0.07) 0%, transparent 70%)',
        }}
      />

      <div
        className="w-full max-w-[400px] bg-white border border-[#EEECE8] rounded-2xl p-8 sm:p-10 relative z-10"
        style={{
          boxShadow: '0 4px 24px rgba(13,15,23,0.07), 0 1px 4px rgba(13,15,23,0.04)',
        }}
      >
        <RouterLink
          to="/login"
          className="inline-flex items-center gap-1.5 mb-6 text-[#6B7180] text-sm font-medium hover:text-[#0D0F17]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </RouterLink>

        {/* ⏳ Checking session */}
        {checkingSession ? (
          <div className="text-center text-sm text-gray-500">
            Verifying reset link…
          </div>
        ) : !validLink ? (
          /* ❌ Invalid or expired link */
          <div className="text-center space-y-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-xl font-bold text-[#0D0F17]">
              Invalid or expired link
            </h2>
            <p className="text-[#6B7180] text-sm">
              This password reset link is no longer valid. Please request a new one.
            </p>

            <RouterLink
              to="/forgot-password"
              className="block w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg text-center"
            >
              Request new link
            </RouterLink>
          </div>
        ) : success ? (
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0D0F17] mb-2">
                Password updated
              </h2>
              <p className="text-[#6B7180] text-sm">
                Your password has been successfully reset. Redirecting to login…
              </p>
            </div>

            <RouterLink
              to="/login"
              className="block w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Go to login
            </RouterLink>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-[#0D0F17] mb-2">
                Set new password
              </h2>
              <p className="text-[#6B7180] text-sm">
                Enter your new password below.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;