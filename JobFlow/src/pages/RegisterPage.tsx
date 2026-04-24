import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Decorative orb (matches LandingPage) ─────────────────────────────────────
const Orb: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

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
      navigate("/login");
    }

  return (
    <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden flex flex-col">
      {/* ── Decorative blobs ─────────────────────────────────────────────── */}
      <Orb style={{ top: '-15%', right: '-8%', width: 650, height: 650, background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)' }} />
      <Orb style={{ bottom: '-8%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(45,82,224,0.08) 0%, transparent 65%)' }} />
      <Orb style={{ top: '35%', left: '60%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)' }} />

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
            <h2
              className="text-[1.75rem] tracking-tight mb-2 text-[#0D0F17]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
            >
              Create your account
            </h2>
            <p className="text-[#6B7180] text-[0.9375rem]">
              Start tracking your job search today!
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0D0F17] mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#EEECE8] bg-[#FAFAF8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/30 focus:border-[#2D52E0] transition-all text-[#0D0F17] placeholder:text-[#C4C0BB]"
                    placeholder="Username"
                  />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1.5">At least 3 characters</p>
              </div>

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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#EEECE8] bg-[#FAFAF8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/30 focus:border-[#2D52E0] transition-all text-[#0D0F17] placeholder:text-[#C4C0BB]"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1.5">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0D0F17] mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#EEECE8] bg-[#FAFAF8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/30 focus:border-[#2D52E0] transition-all text-[#0D0F17] placeholder:text-[#C4C0BB]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 mt-8"
                style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)', boxShadow: '0 4px 14px rgba(45,82,224,0.28)' }}
              >
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#EEECE8] text-center">
            <p className="text-[#6B7180] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#2D52E0] no-underline hover:underline">
                Sign in
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

export default RegisterPage;