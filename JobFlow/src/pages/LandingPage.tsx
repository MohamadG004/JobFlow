import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import { useAuth } from '@/context/AuthContext';

const LandingPage: React.FC = () => {
  const { user, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGuest = () => {
    enterGuestMode();
    navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WorkRoundedIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.04em' }}>
                  JobFlow
                </Typography>
              </Box>

              <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.05 }}>
                Track your job search with ease.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
                Sign up, log in, or preview the app without an account. Stay organized and on top of your applications.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddRoundedIcon />}
                >
                  Sign up
                </Button>

                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  startIcon={<LoginRoundedIcon />}
                >
                  Log in
                </Button>

                <Button
                  onClick={handleGuest}
                  variant="text"
                  size="large"
                  startIcon={<PreviewRoundedIcon />}
                >
                  Guest View
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Note: Your preview session is temporary, so nothing will be saved unless you sign up.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 6, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      What you can do
                    </Typography>
                    <Typography color="text.secondary">
                      Browse your applications, update status with drag-and-drop, and review analytics!
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <RocketLaunchRoundedIcon color="primary" sx={{ fontSize: 28, mt: '4px' }} />
                      <Box>
                        <Typography fontWeight={700}>Explore instantly</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Jump right into the workspace with zero signup friction.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <WorkRoundedIcon color="success" sx={{ fontSize: 28, mt: '4px' }} />
                      <Box>
                        <Typography fontWeight={700}>Track your search</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Add applications, move them through stages, and keep your job hunt organized.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <PreviewRoundedIcon color="secondary" sx={{ fontSize: 28, mt: '4px' }} />
                      <Box>
                        <Typography fontWeight={700}>Preview the app</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Check the app without signing in. Your work stays local until you create an account.
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;