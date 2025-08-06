import React from 'react';
import { Clock, User } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-lg">
            {post.author.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              <p className="text-sm text-gray-500">{post.author.email}</p>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;