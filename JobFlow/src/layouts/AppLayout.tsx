import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Divider,
  IconButton, Tooltip, useTheme, useMediaQuery, alpha,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import { useAuth } from '@/context/AuthContext';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Board', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChartRoundedIcon /> },
  { label: 'Profile', path: '/profile', icon: <PersonRoundedIcon /> },
];

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <WorkRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          JobFlow
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4, height: 20, borderRadius: 1,
                      bgcolor: 'primary.main', ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User section */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar
            sx={{
              width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            }}
          >
            {user?.email?.[0].toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Sign out">
          <ListItemButton
            onClick={handleSignOut}
            sx={{ borderRadius: 2, color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.04) } }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar>
            <IconButton onClick={() => setMobileOpen(true)} edge="start">
              <MenuRoundedIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <WorkRoundedIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>JobFlow</Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 8, md: 0 },
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;