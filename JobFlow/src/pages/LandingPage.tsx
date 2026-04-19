import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowRight, Briefcase, UserPlus, LogIn, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Mini Kanban Preview Card ─────────────────────────────────────────────────
const PreviewCard: React.FC<{
  company: string;
  role: string;
  date: string;
  color: string;
  delay?: string;
}> = ({ company, role, date, color, delay = '0s' }) => (
  <div
    className="bg-white border border-[#EEECE8] border-l-3 rounded-lg p-2.5 shadow-sm"
    style={{ borderLeftColor: color, animation: `float 6s ease-in-out infinite ${delay}` }}
  >
    <p className="font-bold text-xs text-[#0D0F17]" style={{ fontFamily: 'Sora, sans-serif' }}>{company}</p>
    <p className="text-[0.72rem] text-[#6B7180] mt-0.5">{role}</p>
    <p className="text-[0.68rem] text-[#9CA3AF] mt-1.5">{date}</p>
  </div>
);

// ── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/85 backdrop-blur-sm border border-[#EEECE8] rounded-full shadow-sm">
    <span className="text-sm">{icon}</span>
    <span className="text-xs font-semibold text-[#0D0F17]">{label}</span>
  </div>
);

// ── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const { user, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleGuest = () => {
    enterGuestMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: '-15%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(45,82,224,0.10) 0%, transparent 70%)' }}
      />

      {/* Nav */}
      <nav className="px-4 md:px-10 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', boxShadow: '0 2px 8px rgba(45,82,224,0.30)' }}
          >
            <Briefcase className="text-white w-5 h-5" />
          </div>
          <span className="font-extrabold text-[#0D0F17] text-base tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            JobFlow
          </span>
        </div>
        <div className="flex gap-2">
          <RouterLink
            to="/login"
            className="px-3 py-1.5 text-sm text-[#6B7180] hover:text-[#0D0F17] transition-colors"
          >
            Sign in
          </RouterLink>
          <RouterLink
            to="/register"
            className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Get started
          </RouterLink>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 pt-4 md:pt-8 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(45,82,224,0.07)] border border-[rgba(45,82,224,0.15)] rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2D52E0] animate-pulse" />
              <span className="text-xs font-semibold text-[#2D52E0]" style={{ fontFamily: 'Sora, sans-serif' }}>
                Your job search, organized
              </span>
            </div>

            <div>
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-tight tracking-tight text-[#0D0F17] mb-1" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}>
                Track every
              </h1>
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-tight tracking-tight text-transparent bg-clip-text mb-1" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)' }}>
                application.
              </h1>
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-tight tracking-tight text-[#0D0F17]" style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}>
                Land your role.
              </h1>
            </div>

            <p className="text-[#6B7180] text-[1.0625rem] leading-relaxed max-w-[460px]">
              A beautiful kanban board for your job hunt. Add applications, drag them through stages, and stay on top of every opportunity with or without an account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <RouterLink
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Create free account
                <ArrowRight className="w-4 h-4" />
              </RouterLink>
              <RouterLink
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </RouterLink>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FeaturePill icon="🎯" label="Drag & drop board" />
              <FeaturePill icon="📊" label="Analytics" />
              <button
                onClick={handleGuest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-[#6B7180] hover:bg-[rgba(13,15,23,0.04)] rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Continue as guest
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF]">
              Guest sessions are temporary. Sign up to save your data.
            </p>
          </div>

          {/* Right: Mock board preview */}
          <div className="relative flex justify-center">
            {/* Glass board container */}
            <div
              className="w-full max-w-[460px] bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5"
              style={{ boxShadow: '0 20px 60px rgba(13,15,23,0.10), 0 4px 16px rgba(13,15,23,0.06)' }}
            >
              {/* Mock header */}
              <div className="flex justify-center mb-5">
                <div className="px-3 py-1 bg-[#F0EDE8] rounded-md">
                  <span className="text-xs font-semibold text-black">Job Board</span>
                </div>
              </div>

              {/* Columns */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Applied', color: '#2D52E0',
                    cards: [
                      { company: 'Google', role: 'Software Engineer', date: 'Apr 8', delay: '0s' },
                      { company: 'Vercel', role: 'Product Design', date: 'Apr 6', delay: '0.8s' },
                    ],
                  },
                  {
                    label: 'Interview', color: '#C27803',
                    cards: [
                      { company: 'Amazon', role: 'Full Stack', date: 'Apr 3', delay: '1.6s' },
                    ],
                  },
                  {
                    label: 'Offer', color: '#047857',
                    cards: [
                      { company: 'Stripe', role: 'React Developer', date: 'Mar 28', delay: '2.4s' },
                    ],
                  },
                ].map((col) => (
                  <div key={col.label}>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="text-[0.7rem] font-bold" style={{ color: col.color, fontFamily: 'Sora, sans-serif' }}>
                        {col.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {col.cards.map((card) => (
                        <PreviewCard key={card.company} {...card} color={col.color} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating stat badge */}
            <div
              className="absolute -bottom-4 left-4 md:left-[-20px] bg-white border border-[#EEECE8] rounded-xl px-4 py-3 shadow-lg"
              style={{ animation: 'float2 5s ease-in-out infinite' }}
            >
              <p className="text-[0.68rem] text-[#9CA3AF] font-medium">Interview rate</p>
              <p className="text-xl font-extrabold text-[#0D0F17] leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                72%
                <span className="text-xs text-[#047857] ml-2 font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>↑18%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;