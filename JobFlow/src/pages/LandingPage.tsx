import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowRight, Briefcase, UserPlus, LogIn, Eye, Zap, Shield, BarChart3, Layers, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Decorative orb ────────────────────────────────────────────────────────────
const Orb: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

// ── Feature card ──────────────────────────────────────────────────────────────
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}> = ({ icon, title, description, accent }) => (
  <div className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-[#EEECE8] bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
      style={{ background: `radial-gradient(circle at 0% 0%, ${accent}18 0%, transparent 60%)` }}
    />
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ background: `${accent}14`, color: accent }}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-base font-bold text-[#0D0F17] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
        {title}
      </h3>
      <p className="text-sm text-[#6B7180] leading-relaxed">{description}</p>
    </div>
  </div>
);

// ── Check row ─────────────────────────────────────────────────────────────────
const Check: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2.5">
    <CheckCircle2 className="w-4 h-4 text-[#2D52E0] shrink-0" />
    <span className="text-sm text-[#6B7180]">{label}</span>
  </div>
);

// ── Landing Page ──────────────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-[#FAFAF8] relative">
      {/* ── Decorative blobs ──────────────────────────────────────────────── */}
      <Orb style={{ top: '-18%', right: '-10%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)' }} />
      <Orb style={{ top: '5%', left: '-12%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(45,82,224,0.08) 0%, transparent 65%)' }} />

      {/* ────────────────────────── NAV ──────────────────────────────────── */}
      <nav className="relative z-20 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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

        <div className="flex items-center gap-2">
          <RouterLink
            to="/login"
            className="hidden sm:block px-3.5 py-2 text-sm text-[#6B7180] hover:text-[#0D0F17] font-medium transition-colors"
          >
            Sign in
          </RouterLink>
          <RouterLink
            to="/register"
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)' }}
          >
            Get started
          </RouterLink>
        </div>
      </nav>

      {/* ────────────────────────── HERO ─────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0D0F17] leading-[1.08] mb-6"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Your job search,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #2D52E0 30%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            finally organized.
          </span>
        </h1>

        <p className="text-[#6B7180] text-lg leading-relaxed max-w-xl mx-auto mb-10">
          JobFlow gives you a clean, powerful workspace to track applications, manage interviews,
          and land your next role, without the chaos of spreadsheets.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <RouterLink
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)', boxShadow: '0 4px 14px rgba(45,82,224,0.30)' }}
          >
            <UserPlus className="w-4 h-4" />
            Create free account
            <ArrowRight className="w-4 h-4" />
          </RouterLink>
          <RouterLink
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0D0F17] bg-white border border-[#EEECE8] rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </RouterLink>
        </div>

        <button
          onClick={handleGuest}
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#6B7180] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Continue without an account
        </button>
      </section>

      {/* ─────────────────────────── FEATURES ────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-[#2D52E0] uppercase mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            Everything you need
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0F17] tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            Built for motivated job seekers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard icon={<Layers className="w-5 h-5" />} accent="#2D52E0" title="Pipeline Boards" description="Visualize your entire job search across stages, Applied, Interview, Offer, and beyond." />
          <FeatureCard icon={<BarChart3 className="w-5 h-5" />} accent="#7C3AED" title="Smart Analytics" description="Understand your response rates, interview conversion, and which companies are moving fast." />
          <FeatureCard icon={<Zap className="w-5 h-5" />} accent="#D97706" title="Quick Add" description="Log an application in seconds. Just paste a URL and JobFlow fills in the details automatically." />
          <FeatureCard icon={<Shield className="w-5 h-5" />} accent="#059669" title="Reminders & Follow-ups" description="Never let a hot lead go cold. Set follow-up reminders and get notified before deadlines." />
          <FeatureCard icon={<CheckCircle2 className="w-5 h-5" />} accent="#DC2626" title="Interview Prep" description="Attach notes, questions, and prep materials to each application, always at your fingertips." />
          <FeatureCard icon={<Briefcase className="w-5 h-5" />} accent="#2D52E0" title="Works Offline" description="Guest mode lets you get started instantly, no signup required. Sync to the cloud anytime." />
        </div>
      </section>

      {/* ──────────────────── BOTTOM CTA BAND ───────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center border border-[#EEECE8]"
          style={{ background: '#FFFFFF', boxShadow: '0 4px 24px rgba(13,15,23,0.06), 0 1px 4px rgba(13,15,23,0.04)' }}
        >
          {/* Soft color wash */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)', transform: 'translate(25%, -35%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(45,82,224,0.06) 0%, transparent 65%)', transform: 'translate(-25%, 35%)' }}
          />

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ fontFamily: 'Sora, sans-serif', color: '#0D0F17' }}
            >
              Ready to land your next role?
            </h2>
            <p className="text-[#6B7180] text-base mb-10 max-w-md mx-auto leading-relaxed">
              A cleaner, smarter way to manage your job search, from first application to final offer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <RouterLink
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)', boxShadow: '0 4px 14px rgba(45,82,224,0.28)' }}
              >
                <UserPlus className="w-4 h-4" />
                Start for free
                <ArrowRight className="w-4 h-4" />
              </RouterLink>
              <button
                onClick={handleGuest}
                className="inline-flex items-center gap-1.5 px-6 py-3 text-sm font-semibold text-[#6B7180] bg-[#F5F4F1] hover:bg-[#EEECE8] rounded-xl transition-all"
              >
                <Eye className="w-4 h-4" />
                Try as guest
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <Check label="No credit card required" />
              <Check label="Start tracking jobs instantly" />
              <Check label="Free to use" />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── FOOTER ───────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#EEECE8] py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center">
          <p className="text-xs text-[#9CA3AF]">© {new Date().getFullYear()} JobFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;