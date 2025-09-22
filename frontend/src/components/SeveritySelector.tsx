import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Paper,
  Typography,
  Chip,
  Stack,
  FormHelperText,
  Rating,
  Alert,
  AlertTitle
} from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';
import { Severity, severities } from '../data/demoData';

interface SeveritySelectorProps {
  selectedSeverity?: Severity;
  onSeverityChange: (severity: Severity) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const SeveritySelector: React.FC<SeveritySelectorProps> = ({
  selectedSeverity,
  onSeverityChange,
  error,
  helperText,
  required
}) => {
  const getSeverityIcon = (level: number) => {
    if (level <= 2) return <Info fontSize="small" />;
    if (level <= 3) return <Warning fontSize="small" />;
    return <Error fontSize="small" />;
  };

  return (
    <FormControl fullWidth error={error} required={required}>
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Severity Level {required && '*'}
      </FormLabel>
      
      <Box sx={{ mb: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Rate Issue Severity</AlertTitle>
          Help prioritize issues by rating how urgently this needs to be resolved. Consider safety risks and impact on the community.
        </Alert>
        
        <Stack spacing={2}>
          {severities.map((severity) => (
            <Paper
              key={severity.id}
              elevation={selectedSeverity?.id === severity.id ? 3 : 1}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: selectedSeverity?.id === severity.id ? `2px solid ${severity.color}` : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 2,
                  transform: 'translateY(-1px)'
                }
              }}
              onClick={() => onSeverityChange(severity)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: severity.color, display: 'flex', alignItems: 'center' }}>
                  {getSeverityIcon(severity.level)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: severity.color }}>
                      {severity.name}
                    </Typography>
                    <Rating
                      value={severity.level}
                      max={5}
                      size="small"
                      readOnly
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: severity.color,
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {severity.description}
                  </Typography>
                </Box>
                
                {selectedSeverity?.id === severity.id && (
                  <Chip 
                    label="Selected" 
                    size="small" 
                    sx={{ 
                      bgcolor: severity.color + '20', 
                      color: severity.color,
                      fontWeight: 600
                    }} 
                  />
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
      
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      
      {selectedSeverity && (
        <Box sx={{ mt: 2, p: 2, bgcolor: selectedSeverity.color + '08', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: selectedSeverity.color }}>
              {getSeverityIcon(selectedSeverity.level)}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Selected Severity: {selectedSeverity.name}
            </Typography>
            <Rating
              value={selectedSeverity.level}
              max={5}
              size="small"
              readOnly
              sx={{
                '& .MuiRating-iconFilled': {
                  color: selectedSeverity.color,
                }
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            {selectedSeverity.description}
          </Typography>
        </Box>
      )}
    </FormControl>
  );
};

export default SeveritySelector;
