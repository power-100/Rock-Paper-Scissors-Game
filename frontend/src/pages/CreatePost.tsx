import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import {
  PhotoCamera,
  LocationOn,
  MyLocation,
  Close,
  CloudUpload,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CategorySelector from '../components/CategorySelector';
import SeveritySelector from '../components/SeveritySelector';
import { Category, SubCategory, Severity, Post, Location as LocationType, severities, statuses } from '../data/demoData';
import { usePosts } from '../contexts/PostsContext';

interface ImageFile {
  file: File;
  preview: string;
  isGeotagged: boolean;
  location?: LocationType;
}

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { posts, addPost } = usePosts();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locationText: '',
  });
  
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory>();
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [location, setLocation] = useState<LocationType>();
  const [isGeotagged, setIsGeotagged] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Duplicate detection
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  // Validation states
  const [categoryError, setCategoryError] = useState('');
  const [severityError, setSeverityError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get current location using Geolocation API
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // In a real app, you would use reverse geocoding API
          // For demo, we'll create a mock location
          const mockLocation: LocationType = {
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            district: 'Current Location',
            city: 'Your City',
            state: 'Your State'
          };
          
          setLocation(mockLocation);
          setFormData(prev => ({ ...prev, locationText: mockLocation.address }));
          setIsGeotagged(true);
          setLocationLoading(false);
        } catch (err) {
          setError('Failed to get location details');
          setLocationLoading(false);
        }
      },
      (error) => {
        setError('Failed to get your location. Please enter manually.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageFile: ImageFile = {
            file,
            preview: event.target?.result as string,
            isGeotagged: false, // Would check EXIF data in real app
          };
          
          setImages(prev => [...prev, imageFile]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Check for similar posts (duplicate detection)
  const checkForDuplicates = () => {
    if (!selectedCategory || !location) return;
    
    // Simple duplicate detection logic
    const similar = posts.filter(post => {
      const isSameCategory = post.category.id === selectedCategory.id;
      const isNearLocation = location && post.location.latitude && post.location.longitude
        ? Math.abs(post.location.latitude - location.latitude) < 0.01 && 
          Math.abs(post.location.longitude - location.longitude) < 0.01
        : post.location.address.toLowerCase().includes(location.address.toLowerCase());
      
      return isSameCategory && isNearLocation && post.status.id === 'open';
    });
    
    if (similar.length > 0) {
      setSimilarPosts(similar);
      setShowDuplicateDialog(true);
    }
  };

  // Run duplicate check when category or location changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCategory && (location || formData.locationText)) {
        checkForDuplicates();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedCategory, location, formData.locationText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCategoryError('');
    setSeverityError('');

    // Validation
    if (!formData.title || !formData.description || !formData.locationText) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!selectedCategory) {
      setCategoryError('Please select a category');
      return;
    }
    
    if (!selectedSeverity) {
      setSeverityError('Please select a severity level');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would:
      // 1. Upload images to cloud storage
      // 2. Create post with API call
      // 3. Send notifications to relevant authorities
      
      const newPost: Post = {
        id: Date.now().toString(), // Simple ID generation for demo
        title: formData.title,
        description: formData.description,
        location: location || {
          latitude: 0,
          longitude: 0,
          address: formData.locationText,
          district: 'Unknown',
          city: 'Unknown',
          state: 'Unknown'
        },
        author: user!,
        category: selectedCategory!,
        subcategory: selectedSubcategory,
        severity: selectedSeverity!,
        status: statuses.find(s => s.id === 'open')!,
        upvotes: 0,
        upvotedBy: [],
        comments: [],
        images: images.map(img => img.preview),
        thumbnails: images.map(img => img.preview), // In real app, would generate thumbnails
        isGeotagged,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('Creating post:', newPost);
      
      // Add the post to the global state
      addPost(newPost);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/');
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please log in to create a post
        </Typography>
        <Button onClick={() => navigate('/login')} variant="contained">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Report Civic Issue
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Help make your community better by reporting issues that need attention
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Issue Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief, descriptive title of the issue"
                />

                <TextField
                  fullWidth
                  label="Detailed Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  placeholder="Provide detailed information about the issue, including any safety concerns, impact on the community, and how long it has been a problem"
                />
              </Stack>
            </Box>

            {/* Category Selection */}
            <CategorySelector
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={setSelectedCategory}
              onSubcategoryChange={setSelectedSubcategory}
              error={!!categoryError}
              helperText={categoryError}
              required
            />

            {/* Severity Rating */}
            <SeveritySelector
              selectedSeverity={selectedSeverity}
              onSeverityChange={setSelectedSeverity}
              error={!!severityError}
              helperText={severityError}
              required
            />

            {/* Location */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Location Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="locationText"
                    value={formData.locationText}
                    onChange={handleChange}
                    required
                    placeholder="Enter street address, landmark, or area description"
                  />
                  <Button
                    variant="outlined"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    startIcon={locationLoading ? <CircularProgress size={16} /> : <MyLocation />}
                    sx={{ minWidth: '160px' }}
                  >
                    {locationLoading ? 'Getting...' : 'Use Current'}
                  </Button>
                </Box>
                
                {isGeotagged && location && (
                  <Alert severity="success" icon={<CheckCircle />}>
                    Location captured with GPS coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Alert>
                )}
              </Stack>
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Photos (Optional)
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mb: 2 }}
                >
                  Add Photos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Photos help authorities better understand the issue. Multiple images are welcome.
                </Typography>
              </Box>
              
              {images.length > 0 && (
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {images.map((image, index) => (
                    <Card key={index} sx={{ maxWidth: 200, position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={120}
                        image={image.preview}
                        alt={`Upload ${index + 1}`}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption">
                            {image.file.name.substring(0, 15)}...
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            color="error"
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                        {image.isGeotagged && (
                          <Chip
                            size="small"
                            icon={<LocationOn />}
                            label="Geotagged"
                            color="success"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
              sx={{ mt: 3, py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? 'Creating Report...' : 'Submit Report'}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Duplicate Detection Dialog */}
      <Dialog open={showDuplicateDialog} onClose={() => setShowDuplicateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Similar Issues Found
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We found similar issues in your area. Consider upvoting an existing report instead of creating a new one:
          </Typography>
          <List>
            {similarPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <ListItem>
                  <ListItemButton onClick={() => navigate(`/post/${post.id}`)}>
                    <ListItemText
                      primary={post.title}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {post.description.substring(0, 100)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip size="small" label={`${post.upvotes} upvotes`} />
                            <Chip size="small" label={post.severity.name} style={{ backgroundColor: post.severity.color + '20', color: post.severity.color }} />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < similarPosts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDuplicateDialog(false)}>
            Continue with New Report
          </Button>
          <Button onClick={() => navigate('/')} variant="contained">
            View Existing Issues
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreatePost;
