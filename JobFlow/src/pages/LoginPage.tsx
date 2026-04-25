import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Decorative orb (matches LandingPage) ─────────────────────────────────────
const Orb: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

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
    <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden flex flex-col">
      {/* ── Decorative blobs ─────────────────────────────────────────────── */}
      <Orb style={{ top: '-18%', right: '-10%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)' }} />
      <Orb style={{ bottom: '-10%', left: '-12%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(45,82,224,0.08) 0%, transparent 65%)' }} />
      <Orb style={{ top: '40%', left: '55%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)' }} />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="relative z-20 max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', boxShadow: '0 2px 8px rgba(45,82,224,0.28)' }}
          >
            <Briefcase className="text-white w-4 h-4" />
          </div>
          <span className="font-extrabold text-[#0D0F17] text-[15px] tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            JobFlow
          </span>
        </div>
      </nav>

      {/* ── Form card ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-[420px] bg-white rounded-3xl border border-[#EEECE8] p-8 sm:p-10"
          style={{ boxShadow: '0 4px 24px rgba(13,15,23,0.06), 0 1px 4px rgba(13,15,23,0.04)' }}
        >
          {/* Header */}
          <div className="mb-6">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
              style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)', color: '#2D52E0', fontFamily: 'Sora, sans-serif' }}
            >
              Welcome back!
            </div>
            <h2
              className="text-[1.75rem] tracking-tight mb-2 text-[#0D0F17]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Sign in to JobFlow
            </h2>
            <p className="text-[#6B7180] text-[0.9375rem]">
              Pick up right where you left off.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#0D0F17] mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#EEECE8] bg-[#FAFAF8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/30 focus:border-[#2D52E0] transition-all text-[#0D0F17] placeholder:text-[#C4C0BB]"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0D0F17] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-2.5 border border-[#EEECE8] bg-[#FAFAF8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/30 focus:border-[#2D52E0] transition-all text-[#0D0F17] placeholder:text-[#C4C0BB]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7180] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link
                    to="/forgot-password"
                    className="text-[0.8125rem] font-semibold text-[#2D52E0] no-underline hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)', boxShadow: '0 4px 14px rgba(45,82,224,0.28)' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EEECE8] text-center">
            <p className="text-[#6B7180] text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-[#2D52E0] no-underline hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#EEECE8] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <p className="text-xs text-[#9CA3AF]">© {new Date().getFullYear()} JobFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;