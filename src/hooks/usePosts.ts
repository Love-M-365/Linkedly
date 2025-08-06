import { useState, useEffect } from 'react';
import { Post, User } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      setPosts(savedPosts.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = (content: string, user: User) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      content,
      createdAt: new Date().toISOString(),
      author: {
        name: user.name,
        email: user.email,
      },
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.userId === userId);
  };

  return {
    posts,
    loading,
    createPost,
    getUserPosts,
    refreshPosts: loadPosts,
  };
};