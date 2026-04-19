import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Brand Panel ───────────────────────────────────────────────────────────────
const BrandPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="hidden md:flex flex-col justify-between w-[42%] min-h-screen p-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D0F17 0%, #161829 60%, #1E1535 100%)' }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '20%', right: '-15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(45,82,224,0.16) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: '25%', left: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
      />

      {/* Logo — clicks to landing page */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-3 cursor-pointer relative z-10 w-fit"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', boxShadow: '0 2px 10px rgba(45,82,224,0.40)' }}
        >
          <Briefcase className="text-white w-5 h-5" />
        </div>
        <span className="font-extrabold text-white text-lg tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          JobFlow
        </span>
      </div>

      {/* Copy */}
      <div className="relative z-10">
        <h1
          className="text-[2.1rem] leading-tight tracking-tight text-white mb-6"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          One place for
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)' }}
          >
            every application.
          </span>
        </h1>

        <div className="space-y-3">
          {[
            'Drag-and-drop kanban board',
            'Track interviews & offers',
            'Analytics dashboard',
            'Free forever, no credit card',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle className="text-[#818CF8] w-4 h-4 flex-shrink-0" />
              <span className="text-white/65 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/30 text-[0.8125rem] relative z-10">
        Already have an account?{' '}
        <Link to="/login" className="text-[#cbcbcb] font-semibold no-underline hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-6">
        <div
          className="max-w-[420px] w-full text-center bg-white border border-[#EEECE8] rounded-2xl p-8 sm:p-10"
          style={{ boxShadow: '0 8px 32px rgba(13,15,23,0.08)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)' }}
          >
            📬
          </div>
          <h2
            className="text-xl font-extrabold mb-2 text-[#0D0F17]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Check your inbox
          </h2>
          <p className="text-[#6B7180] mb-6 leading-relaxed">
            We sent a confirmation link to{' '}
            <span className="font-semibold text-[#0D0F17]">{email}</span>.
            Click it to activate your account.
          </p>
          <Link
            to="/login"
            className="block w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <BrandPanel />

      {/* Form side */}
      <div
        className="flex-1 flex flex-col justify-center items-center bg-[#FAFAF8] p-6 sm:p-10 overflow-y-auto"
      >
        {/* Mobile logo — clicks to landing page */}
        <div
          onClick={() => navigate('/')}
          className="flex md:hidden items-center gap-3 cursor-pointer mb-12"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
          >
            <Briefcase className="text-white w-5 h-5" />
          </div>
          <span className="font-extrabold text-[#0D0F17] text-base tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            JobFlow
          </span>
        </div>

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h2
              className="text-[1.75rem] tracking-tight mb-2 text-[#0D0F17]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Create your account
            </h2>
            <p className="text-[#6B7180] text-[0.9375rem]">
              Start tracking your job search today. It&apos;s free!
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
                <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="johndoe"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">At least 3 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D0F17] mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EEECE8] text-center">
            <p className="text-[#6B7180] text-[0.875rem]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[var(--color-primary)] no-underline hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;