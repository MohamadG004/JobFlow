import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Brand Panel (left side) ───────────────────────────────────────────────────
const BrandPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="hidden md:flex flex-col justify-between w-[45%] min-h-screen p-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D0F17 0%, #161829 60%, #1E1535 100%)' }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 360, height: 360, background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: '15%', right: '-10%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(45,82,224,0.14) 0%, transparent 70%)' }}
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

      {/* Main copy */}
      <div className="relative z-10">
        <h1
          className="text-[2.25rem] leading-tight tracking-tight text-white mb-4"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
        >
          Your next role
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)' }}
          >
            starts here.
          </span>
        </h1>
        <p className="text-white/45 text-[0.9375rem] leading-relaxed max-w-[300px]">
          Track every application, nail every interview, and land the job you deserve.
        </p>
      </div>

      {/* Social proof */}
      <div className="relative z-10">
        <p className="text-[#6B7180] text-[0.875rem]">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#cbcbcb] no-underline hover:text-white transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

// ── Login Page ────────────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <BrandPanel />

      {/* Form Side */}
      <div
        className="flex-1 flex flex-col justify-center items-center bg-[#FAFAF8] p-6 sm:p-10 relative"
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
              Welcome back
            </h2>
            <p className="text-[#6B7180] text-[0.9375rem]">
              Sign in to your account to continue
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-[0.8125rem] font-semibold text-[var(--color-primary)] no-underline hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EEECE8] text-center">
            <p className="text-[#6B7180] text-[0.875rem]">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[var(--color-primary)] no-underline hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;