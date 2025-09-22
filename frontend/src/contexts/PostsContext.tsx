import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, demoPosts } from '../data/demoData';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  getPostsByUser: (userId: string) => Post[];
  upvotePost: (postId: string, userId: string) => void;
  downvotePost: (postId: string, userId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(demoPosts);

  const addPost = (post: Post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, ...updates, updatedAt: new Date() }
          : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const getPostsByUser = (userId: string) => {
    return posts.filter(post => post.author.id === userId);
  };

  const upvotePost = (postId: string, userId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const hasUpvoted = post.upvotedBy.includes(userId);
          return {
            ...post,
            upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            upvotedBy: hasUpvoted
              ? post.upvotedBy.filter(id => id !== userId)
              : [...post.upvotedBy, userId],
            updatedAt: new Date()
          };
        }
        return post;
      })
    );
  };

  const downvotePost = (postId: string, userId: string) => {
    // For now, we'll just handle upvotes. Downvotes can be added later if needed
    upvotePost(postId, userId);
  };

  const value: PostsContextType = {
    posts,
    addPost,
    updatePost,
    deletePost,
    getPostsByUser,
    upvotePost,
    downvotePost,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};
