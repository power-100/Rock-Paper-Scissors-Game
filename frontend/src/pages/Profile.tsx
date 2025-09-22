import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile page for user {id} - Coming soon!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Profile;
