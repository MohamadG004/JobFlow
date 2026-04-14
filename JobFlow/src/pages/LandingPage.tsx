import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import { useAuth } from '@/context/AuthContext';

// ── Mini Kanban Preview Card ─────────────────────────────────────────────────
const PreviewCard: React.FC<{
  company: string;
  role: string;
  date: string;
  color: string;
  delay?: string;
}> = ({ company, role, date, color, delay = '0s' }) => (
  <Box
    sx={{
      bgcolor: '#fff',
      border: '1px solid #EEECE8',
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      p: '10px 12px',
      boxShadow: '0 1px 3px rgba(13,15,23,0.06)',
      animation: 'float 6s ease-in-out infinite',
      animationDelay: delay,
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-4px)' },
      },
    }}
  >
    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0D0F17', fontFamily: '"Sora", sans-serif' }}>
      {company}
    </Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#6B7180', mt: 0.25 }}>{role}</Typography>
    <Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF', mt: 0.75 }}>{date}</Typography>
  </Box>
);

// ── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1.5,
      py: 0.75,
      bgcolor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #EEECE8',
      borderRadius: '100px',
      boxShadow: '0 1px 3px rgba(13,15,23,0.06)',
    }}
  >
    <Box component="span" sx={{ fontSize: '0.9rem' }}>{icon}</Box>
    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#0D0F17' }}>{label}</Typography>
  </Box>
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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FAFAF8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-15%', left: '-8%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,82,224,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <Box
        component="nav"
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(45,82,224,0.30)',
            }}
          >
            <WorkRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', color: '#0D0F17' }}>
            JobFlow
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            size="small"
            sx={{ color: '#6B7180', '&:hover': { color: '#0D0F17' } }}
          >
            Sign in
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="small"
          >
            Get started
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 2, md: 4 }, pb: 5 }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          {/* Left: Copy */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5, py: 0.75,
                  bgcolor: 'rgba(45,82,224,0.07)',
                  border: '1px solid rgba(45,82,224,0.15)',
                  borderRadius: '100px',
                  width: 'fit-content',
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2D52E0', animation: 'pulse 2s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#2D52E0', fontFamily: '"Sora",sans-serif' }}>
                  Your job search, organized
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    lineHeight: 1.08,
                    letterSpacing: '-0.04em',
                    color: '#0D0F17',
                    mb: 0.5,
                  }}
                >
                  Track every
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    lineHeight: 1.08,
                    letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    mb: 0.5,
                  }}
                >
                  application.
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    lineHeight: 1.08,
                    letterSpacing: '-0.04em',
                    color: '#0D0F17',
                  }}
                >
                  Land your role.
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: '#6B7180',
                  fontSize: '1.0625rem',
                  lineHeight: 1.65,
                  maxWidth: 460,
                }}
              >
                A beautiful kanban board for your job hunt. Add applications, drag them through stages, and stay on top of every opportunity with or without an account.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start' }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddRoundedIcon />}
                  endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={{ px: 3 }}
                >
                  Create free account
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  startIcon={<LoginRoundedIcon />}
                >
                  Sign in
                </Button>
              </Stack>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <FeaturePill icon="🎯" label="Drag & drop board" />
                <FeaturePill icon="📊" label="Analytics" />
                <Button
                  onClick={handleGuest}
                  size="small"
                  startIcon={<PreviewRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
                  sx={{
                    color: '#9CA3AF', fontSize: '0.78rem', fontWeight: 600,
                    px: 1.5, py: 0.75, height: 'auto',
                    '&:hover': { color: '#6B7180', bgcolor: 'rgba(13,15,23,0.04)' },
                  }}
                >
                  Continue as guest
                </Button>
              </Stack>

              <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                Guest sessions are temporary. Sign up to save your data.
              </Typography>
            </Stack>
          </Grid>

          {/* Right: Mock board preview */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Glass board container */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 460,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(13,15,23,0.10), 0 4px 16px rgba(13,15,23,0.06)',
                  p: 2.5,
                  overflow: 'hidden',
                }}
              >
                {/* Mock header */}
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
                  <Box sx={{ px: 1.5, py: 0.4, bgcolor: '#F0EDE8', borderRadius: '6px' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#000000' }}>Job Board</Typography>
                  </Box>
                </Stack>

                {/* Columns */}
                <Grid container spacing={1.5}>
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
                    <Grid item xs={4} key={col.label}>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.25 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: col.color }} />
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: col.color, fontFamily: '"Sora",sans-serif' }}>
                            {col.label}
                          </Typography>
                        </Stack>
                        <Stack spacing={1}>
                          {col.cards.map((card) => (
                            <PreviewCard key={card.company} {...card} color={col.color} />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Floating stat badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -16,
                  left: { xs: 12, md: -20 },
                  bgcolor: '#fff',
                  border: '1px solid #EEECE8',
                  borderRadius: '12px',
                  px: 2,
                  py: 1.5,
                  boxShadow: '0 8px 24px rgba(13,15,23,0.10)',
                  animation: 'float2 5s ease-in-out infinite',
                  '@keyframes float2': {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 500 }}>Interview rate</Typography>
                <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#0D0F17', lineHeight: 1.2 }}>
                  72%
                  <Box component="span" sx={{ fontSize: '0.75rem', color: '#047857', ml: 0.85, fontFamily: '"DM Sans",sans-serif', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}><span>↑</span><span>18%</span></Box>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;