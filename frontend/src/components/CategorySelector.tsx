import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Paper,
  Typography,
  Chip,
  Stack,
  FormHelperText,
  Collapse,
  Alert,
  AlertTitle
} from '@mui/material';
import { Category, SubCategory, categories } from '../data/demoData';

interface CategorySelectorProps {
  selectedCategory?: Category;
  selectedSubcategory?: SubCategory;
  onCategoryChange: (category: Category) => void;
  onSubcategoryChange: (subcategory?: SubCategory) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  error,
  helperText,
  required
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    selectedCategory?.id || null
  );

  const handleCategorySelect = (category: Category) => {
    onCategoryChange(category);
    setExpandedCategory(category.id);
    
    // Reset subcategory if switching categories
    if (selectedCategory?.id !== category.id) {
      onSubcategoryChange(undefined);
    }
  };

  const handleSubcategorySelect = (subcategory: SubCategory) => {
    onSubcategoryChange(selectedSubcategory?.id === subcategory.id ? undefined : subcategory);
  };

  return (
    <FormControl fullWidth error={error} required={required}>
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Category {required && '*'}
      </FormLabel>
      
      <Box sx={{ mb: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Select Issue Category</AlertTitle>
          Choose the category that best describes your civic issue. Then select a specific subcategory for more precise classification.
        </Alert>
        
        <Stack spacing={2}>
          {categories.map((category) => (
            <Paper
              key={category.id}
              elevation={selectedCategory?.id === category.id ? 3 : 1}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: selectedCategory?.id === category.id ? `2px solid ${category.color}` : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 2,
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => handleCategorySelect(category)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: '1.5rem' }}>
                  {category.icon}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: category.color }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.subcategories.length} subcategories available
                  </Typography>
                </Box>
                {selectedCategory?.id === category.id && (
                  <Chip 
                    label="Selected" 
                    size="small" 
                    sx={{ 
                      bgcolor: category.color + '20', 
                      color: category.color,
                      fontWeight: 600
                    }} 
                  />
                )}
              </Box>
              
              <Collapse in={expandedCategory === category.id}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Select specific issue type:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {category.subcategories.map((subcategory) => (
                      <Chip
                        key={subcategory.id}
                        label={subcategory.name}
                        variant={selectedSubcategory?.id === subcategory.id ? 'filled' : 'outlined'}
                        clickable
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategorySelect(subcategory);
                        }}
                        sx={{
                          borderColor: category.color,
                          color: selectedSubcategory?.id === subcategory.id ? 'white' : category.color,
                          bgcolor: selectedSubcategory?.id === subcategory.id ? category.color : 'transparent',
                          '&:hover': {
                            bgcolor: selectedSubcategory?.id === subcategory.id 
                              ? category.color 
                              : category.color + '10'
                          },
                          '& .MuiChip-label': {
                            fontSize: '0.75rem',
                            px: 1
                          }
                        }}
                        size="small"
                      />
                    ))}
                  </Stack>
                  
                  {selectedSubcategory && expandedCategory === category.id && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: category.color + '08', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        <strong>{selectedSubcategory.name}:</strong> {selectedSubcategory.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>
      </Box>
      
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      
      {selectedCategory && (
        <Box sx={{ mt: 2, p: 2, bgcolor: selectedCategory.color + '08', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Selected Category: {selectedCategory.icon} {selectedCategory.name}
          </Typography>
          {selectedSubcategory && (
            <Typography variant="body2">
              Issue Type: {selectedSubcategory.name}
            </Typography>
          )}
        </Box>
      )}
    </FormControl>
  );
};

export default CategorySelector;
