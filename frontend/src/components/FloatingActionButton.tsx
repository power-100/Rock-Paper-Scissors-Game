import React from 'react';
import { Fab, useTheme, useMediaQuery } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FloatingActionButton: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/create-post');
    } else {
      navigate('/login');
    }
  };

  // Only show on mobile when authenticated, or always show when not authenticated
  if (!isMobile && isAuthenticated) {
    return null;
  }

  return (
    <Fab
      color="primary"
      aria-label="create post"
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        boxShadow: theme.shadows[8],
        '&:hover': {
          transform: 'scale(1.1)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <Add />
    </Fab>
  );
};

export default FloatingActionButton;
