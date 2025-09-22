import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  Stack,
  Card,
  CardMedia,
  Divider,
  Rating,
  Tooltip,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  ThumbUp,
  ThumbUpOutlined,
  Share,
  LocationOn,
  Schedule,
  Person,
  Send,
  Close,
  NavigateNext,
  NavigateBefore,
  GpsFixed,
  Visibility
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostsContext';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, upvotePost } = usePosts();
  const post = posts.find(p => p.id === id);

  const [isUpvoted, setIsUpvoted] = useState(
    user && post ? post.upvotedBy.includes(user.id) : false
  );
  const [commentText, setCommentText] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Post not found
        </Typography>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBack />}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const handleUpvote = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    upvotePost(post!.id, user.id);
    setIsUpvoted(!isUpvoted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    
    // In real app, would make API call to add comment
    console.log('Adding comment:', commentText);
    setCommentText('');
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const openImageDialog = (index: number) => {
    setSelectedImageIndex(index);
    setImageDialogOpen(true);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? post.images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === post.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Issues
      </Button>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              {/* Status and Category */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={post.status.name}
                  sx={{
                    bgcolor: post.status.color,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Typography sx={{ fontSize: '1.5rem' }}>{post.category.icon}</Typography>
                <Chip
                  label={post.category.name}
                  sx={{
                    bgcolor: post.category.color + '20',
                    color: post.category.color,
                    fontWeight: 600
                  }}
                />
                {post.subcategory && (
                  <Chip
                    size="small"
                    label={post.subcategory.name}
                    variant="outlined"
                    sx={{
                      borderColor: post.category.color,
                      color: post.category.color
                    }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {post.title}
              </Typography>

              {/* Author and Meta Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {post.author.fullName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule fontSize="small" />
                      <Typography variant="caption">
                        {formatTimeAgo(post.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility fontSize="small" />
                      <Typography variant="caption">
                        {Math.floor(Math.random() * 100) + 50} views
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Severity Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Severity:
                </Typography>
                <Rating
                  value={post.severity.level}
                  max={5}
                  size="small"
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: post.severity.color,
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: post.severity.color, fontWeight: 600 }}>
                  {post.severity.name}
                </Typography>
              </Box>

              {/* Location */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  {post.location.address}
                </Typography>
                {post.isGeotagged && (
                  <Tooltip title="GPS coordinates available">
                    <GpsFixed fontSize="small" color="success" />
                  </Tooltip>
                )}
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant={isUpvoted ? 'contained' : 'outlined'}
                  startIcon={isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                  onClick={handleUpvote}
                  sx={{
                    bgcolor: isUpvoted ? post.severity.color : 'transparent',
                    borderColor: post.severity.color,
                    color: isUpvoted ? 'white' : post.severity.color,
                    '&:hover': {
                      bgcolor: isUpvoted ? post.severity.color : post.severity.color + '10',
                    }
                  }}
                >
                  {post.upvotes + (isUpvoted && !post.upvotedBy.includes(user?.id || '') ? 1 : 0)} Upvotes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </Stack>
            </Box>

            {/* Images */}
            {post.images.length > 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Photos ({post.images.length})
                </Typography>
                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                  {post.images.map((image, index) => (
                    <Card
                      key={index}
                      sx={{
                        minWidth: 200,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                      onClick={() => openImageDialog(index)}
                    >
                      <CardMedia
                        component="img"
                        height={120}
                        image={image}
                        alt={`${post.title} - Photo ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Description */}
            <Box sx={{ p: 3, pt: post.images.length > 0 ? 0 : 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 3 }}>
                {post.description}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          {/* Location Details */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Location Details
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Address:</strong> {post.location.address}
              </Typography>
              {post.location.district && (
                <Typography variant="body2">
                  <strong>District:</strong> {post.location.district}
                </Typography>
              )}
              {post.location.city && (
                <Typography variant="body2">
                  <strong>City:</strong> {post.location.city}
                </Typography>
              )}
              {post.location.state && (
                <Typography variant="body2">
                  <strong>State:</strong> {post.location.state}
                </Typography>
              )}
              {post.isGeotagged && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  GPS coordinates: {post.location.latitude.toFixed(6)}, {post.location.longitude.toFixed(6)}
                </Alert>
              )}
            </Stack>
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Comments ({post.comments.length})
            </Typography>

            {/* Add Comment Form */}
            {user ? (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share your thoughts or provide additional information..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  disabled={!commentText.trim()}
                  size="small"
                >
                  Post Comment
                </Button>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Button onClick={() => navigate('/login')} variant="text" sx={{ p: 0 }}>
                  Sign in
                </Button> to join the conversation
              </Alert>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* Comments List */}
            {post.comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No comments yet. Be the first to share your thoughts!
              </Typography>
            ) : (
              <Stack spacing={2}>
                {post.comments.map((comment) => (
                  <Box key={comment.id}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Avatar 
                        src={comment.author.avatar} 
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {comment.author.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(comment.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {comment.content}
                        </Typography>
                        {comment.upvotes && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <IconButton size="small">
                              <ThumbUpOutlined fontSize="small" />
                            </IconButton>
                            <Typography variant="caption">{comment.upvotes}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black' }
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', zIndex: 1 }}
          >
            <Close />
          </IconButton>

          {post.images.length > 1 && (
            <>
              <IconButton
                onClick={() => navigateImage('prev')}
                sx={{ position: 'absolute', left: 16, color: 'white', zIndex: 1 }}
              >
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={() => navigateImage('next')}
                sx={{ position: 'absolute', right: 16, color: 'white', zIndex: 1 }}
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          <img
            src={post.images[selectedImageIndex]}
            alt={`${post.title} - Photo ${selectedImageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />

          {post.images.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1
              }}
            >
              {post.images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === selectedImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default PostDetails;
