import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
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
    <div
      className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '-5%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: '-10%', left: '-5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(45,82,224,0.07) 0%, transparent 70%)' }}
      />

      <div
        className="w-full max-w-[400px] bg-white border border-[#EEECE8] rounded-2xl p-8 sm:p-10 relative z-10"
        style={{ boxShadow: '0 4px 24px rgba(13,15,23,0.07), 0 1px 4px rgba(13,15,23,0.04)' }}
      >
        <RouterLink
          to="/login"
          className="inline-flex items-center gap-1.5 mb-6 text-[#6B7180] no-underline text-sm font-medium hover:text-[#0D0F17] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </RouterLink>

        {sent ? (
          <div className="space-y-6 text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)' }}
            >
              ✉️
            </div>
            <div>
              <h2
                className="text-xl font-extrabold mb-2 text-[#0D0F17]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Email sent!
              </h2>
              <p className="text-[#6B7180] text-[0.9375rem] leading-relaxed">
                We sent a reset link to{' '}
                <span className="font-semibold text-[#0D0F17]">{email}</span>.
                Check your inbox and follow the instructions.
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-left">
              Reset link sent! If you don&apos;t see it, check your spam folder.
            </div>
            <RouterLink
              to="/login"
              className="block w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to sign in
            </RouterLink>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div
                className="w-13 h-13 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)' }}
              >
                <Mail className="text-[var(--color-primary)] w-6 h-6" />
              </div>
              <h2
                className="text-xl font-extrabold mb-2 text-[#0D0F17]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Reset your password
              </h2>
              <p className="text-[#6B7180] text-[0.9375rem] leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset your password.
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
                  <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;