import React, { useState, useMemo } from 'react';
import { Container, Typography, Box, Stack, TextField, Chip, MenuItem, Button, Paper, Tabs, Tab, Alert } from '@mui/material';
import { Search, FilterList, Add, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categories, severities, statuses, Category, Severity, Status } from '../data/demoData';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostsContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, upvotePost } = usePosts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [activeTab, setActiveTab] = useState(0);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const categoryMatch = selectedCategory === 'all' || post.category.id === selectedCategory;
      
      // Severity filter
      const severityMatch = selectedSeverity === 'all' || post.severity.id === selectedSeverity;
      
      // Status filter
      const statusMatch = selectedStatus === 'all' || post.status.id === selectedStatus;
      
      return searchMatch && categoryMatch && severityMatch && statusMatch;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'upvotes':
          return b.upvotes - a.upvotes;
        case 'comments':
          return b.comments.length - a.comments.length;
        case 'severity':
          return b.severity.level - a.severity.level;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedSeverity, selectedStatus, sortBy]);

  // Get posts by status for tabs
  const getPostsByStatus = (status: string) => {
    if (status === 'all') return filteredPosts;
    return filteredPosts.filter(post => post.status.id === status);
  };

  const openPosts = getPostsByStatus('open');
  const inProgressPosts = getPostsByStatus('in-progress');
  const resolvedPosts = getPostsByStatus('resolved');

  const getCurrentPosts = () => {
    switch (activeTab) {
      case 1: return inProgressPosts;
      case 2: return resolvedPosts;
      case 0:
      default: return openPosts;
    }
  };

  const handleUpvote = (postId: string) => {
    if (user) {
      upvotePost(postId, user.id);
    } else {
      navigate('/login');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
    setSortBy('recent');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          CivicReport
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          Report civic issues, track progress, and help make your community better
        </Typography>
        
        {/* Call to Action */}
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/create')}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600
          }}
        >
          Report an Issue
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search issues by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Filter Row */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Filters:
              </Typography>
            </Box>
            
            <TextField
              select
              size="small"
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Severity"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">All Severities</MenuItem>
              {severities.map((severity) => (
                <MenuItem key={severity.id} value={severity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: severity.color
                      }}
                    />
                    {severity.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="upvotes">Most Upvoted</MenuItem>
              <MenuItem value="comments">Most Discussed</MenuItem>
              <MenuItem value="severity">High Severity</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              sx={{ borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ px: 2, pt: 1 }}
        >
          <Tab
            label={`Open Issues (${openPosts.length})`}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label={`In Progress (${inProgressPosts.length})`}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label={`Resolved (${resolvedPosts.length})`}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Paper>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== 'all' || selectedSeverity !== 'all' || selectedStatus !== 'all') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
            {selectedCategory !== 'all' && (
              <Chip
                label={`Category: ${categories.find(c => c.id === selectedCategory)?.name}`}
                onDelete={() => setSelectedCategory('all')}
                size="small"
              />
            )}
            {selectedSeverity !== 'all' && (
              <Chip
                label={`Severity: ${severities.find(s => s.id === selectedSeverity)?.name}`}
                onDelete={() => setSelectedSeverity('all')}
                size="small"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Results Count */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom>
          {getCurrentPosts().length} Issues Found
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn fontSize="small" />
            {user.location || 'Location not set'}
          </Typography>
        )}
      </Box>

      {/* Posts Grid */}
      {getCurrentPosts().length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No issues found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {activeTab === 0 
              ? "There are no open issues matching your filters."
              : activeTab === 1
              ? "There are no issues currently in progress."
              : "There are no resolved issues matching your filters."
            }
          </Typography>
          {activeTab === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
            >
              Report the First Issue
            </Button>
          )}
        </Box>
      ) : (
        <Stack spacing={3}>
          {getCurrentPosts().map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
            />
          ))}
        </Stack>
      )}

      {/* Demo Mode Notice */}
      {user && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Demo Mode:</strong> You're viewing sample civic issues. In the full version, you'd see real issues from your area and be able to interact with local authorities.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default Home;
