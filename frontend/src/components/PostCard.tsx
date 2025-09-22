import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Button,
  Stack,
  Badge,
  Dialog,
  DialogContent,
  Tooltip,
  Rating
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  Comment,
  LocationOn,
  Schedule,
  Share,
  MoreVert,
  ArrowForward,
  Image as ImageIcon,
  GpsFixed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Post } from '../data/demoData';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostsContext';

interface PostCardProps {
  post: Post;
  onUpvote?: (postId: string) => void;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpvote, compact = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { upvotePost } = usePosts();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(
    user ? post.upvotedBy.includes(user.id) : false
  );

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    upvotePost(post.id, user.id);
    setIsUpvoted(!isUpvoted);
    onUpvote?.(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: `${window.location.origin}/post/${post.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    }
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setImageDialogOpen(true);
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

  const primaryImage = post.images[0] || post.thumbnails?.[0];
  const hasImages = post.images.length > 0;

  return (
    <>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={() => navigate(`/post/${post.id}`)}
      >
        {/* Status Badge */}
        <Chip
          size="small"
          label={post.status.name}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            bgcolor: post.status.color,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem'
          }}
        />

        {/* Image Section */}
        {hasImages && (
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height={compact ? 150 : 200}
              image={primaryImage}
              alt={post.title}
              sx={{
                objectFit: 'cover',
                filter: post.status.id === 'resolved' ? 'grayscale(0.3)' : 'none'
              }}
            />
            
            {/* Image count indicator */}
            {post.images.length > 1 && (
              <Chip
                size="small"
                icon={<ImageIcon />}
                label={`${post.images.length}`}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '0.7rem'
                }}
                onClick={(e) => handleImageClick(0, e)}
              />
            )}
            
            {/* Geotagged indicator */}
            {post.isGeotagged && (
              <Tooltip title="GPS Location Available">
                <GpsFixed
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    p: 0.5,
                    fontSize: '1rem'
                  }}
                />
              </Tooltip>
            )}
            
            {/* Severity overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  {post.severity.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <CardContent sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.fullName}
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {post.author.fullName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Schedule fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {post.location.address}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{post.category.icon}</Typography>
            <Chip
              size="small"
              label={post.category.name}
              sx={{
                bgcolor: post.category.color + '20',
                color: post.category.color,
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
            {post.subcategory && (
              <Chip
                size="small"
                label={post.subcategory.name}
                variant="outlined"
                sx={{
                  borderColor: post.category.color + '40',
                  color: post.category.color,
                  fontSize: '0.65rem'
                }}
              />
            )}
          </Box>

          {/* Title and Description */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: compact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4
            }}
          >
            {post.description}
          </Typography>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1}>
              {/* Upvote Button */}
              <Button
                variant={isUpvoted ? 'contained' : 'outlined'}
                size="small"
                startIcon={isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                onClick={handleUpvote}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: isUpvoted ? post.severity.color : 'transparent',
                  borderColor: post.severity.color,
                  color: isUpvoted ? 'white' : post.severity.color,
                  '&:hover': {
                    bgcolor: isUpvoted ? post.severity.color : post.severity.color + '10',
                  },
                  fontSize: '0.75rem'
                }}
              >
                {post.upvotes + (isUpvoted && !post.upvotedBy.includes(user?.id || '') ? 1 : 0)}
              </Button>

              {/* Comments Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Comment />}
                onClick={() => navigate(`/post/${post.id}`)}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  borderColor: 'grey.400',
                  color: 'text.secondary',
                  fontSize: '0.75rem'
                }}
              >
                {post.comments.length}
              </Button>
            </Stack>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleShare}
                sx={{ color: 'text.secondary' }}
              >
                <Share fontSize="small" />
              </IconButton>
              
              <Button
                variant="text"
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate(`/post/${post.id}`)}
                sx={{
                  color: 'primary.main',
                  fontSize: '0.75rem',
                  textTransform: 'none'
                }}
              >
                Details
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <img
              src={post.images[selectedImageIndex]}
              alt={`${post.title} - Image ${selectedImageIndex + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
            
            {/* Image navigation */}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
