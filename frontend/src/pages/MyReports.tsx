import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  TextField,
  Chip,
  MenuItem,
  Button,
  Paper,
  Tabs,
  Tab,
  Alert,
  Card,
  CardContent,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  TrendingUp,
  Comment,
  Visibility,
  Schedule
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categories, severities, statuses } from '../data/demoData';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostsContext';

const MyReports: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, getPostsByUser, upvotePost } = usePosts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [activeTab, setActiveTab] = useState(0);

  // Get user's posts
  const userPosts = useMemo(() => {
    if (!user) return [];
    return getPostsByUser(user.id);
  }, [user, getPostsByUser]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = userPosts.filter(post => {
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
  }, [userPosts, searchTerm, selectedCategory, selectedSeverity, selectedStatus, sortBy]);

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
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
    setSortBy('recent');
  };

  // Calculate statistics
  const totalUpvotes = userPosts.reduce((sum, post) => sum + post.upvotes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalViews = userPosts.length * Math.floor(Math.random() * 50 + 20); // Mock views

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please log in to view your reports
        </Typography>
        <Button onClick={() => navigate('/login')} variant="contained">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={user.avatar} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              My Reports
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {user.fullName}'s civic issue reports
            </Typography>
          </Box>
        </Box>
        
        {/* Statistics Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {userPosts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reports
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {totalUpvotes}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Upvotes
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Comment color="info" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {totalComments}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Comments
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                <Visibility color="warning" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {totalViews}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Views
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Call to Action */}
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/create-post')}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600
          }}
        >
          Report New Issue
        </Button>
      </Box>

      {userPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't reported any issues yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start making your community better by reporting civic issues you encounter.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create-post')}
          >
            Report Your First Issue
          </Button>
        </Box>
      ) : (
        <>
          {/* Search and Filters */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Stack spacing={3}>
              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search your reports..."
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
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: status.color
                          }}
                        />
                        {status.name}
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
                label={`Open (${openPosts.length})`}
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
                {selectedStatus !== 'all' && (
                  <Chip
                    label={`Status: ${statuses.find(s => s.id === selectedStatus)?.name}`}
                    onDelete={() => setSelectedStatus('all')}
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              {getCurrentPosts().length} Reports Found
            </Typography>
            {getCurrentPosts().length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Posts Grid */}
          {getCurrentPosts().length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reports found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 0 
                  ? "You have no open reports matching your filters."
                  : activeTab === 1
                  ? "You have no reports currently in progress."
                  : "You have no resolved reports matching your filters."
                }
              </Typography>
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

          {/* Progress Indicator */}
          {userPosts.length > 0 && (
            <Alert severity="info" sx={{ mt: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Your Impact:</strong> You've reported {userPosts.length} issues, received {totalUpvotes} upvotes, and generated {totalComments} community discussions.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">Progress to Community Champion:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((userPosts.length / 10) * 100, 100)} 
                  sx={{ flex: 1 }}
                />
                <Typography variant="caption">
                  {Math.min(userPosts.length, 10)}/10
                </Typography>
              </Box>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default MyReports;
