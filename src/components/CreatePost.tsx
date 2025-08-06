import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CreatePostProps {
  onCreatePost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreatePost(content.trim());
      setContent('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              className="w-full resize-none border-0 outline-none text-lg placeholder-gray-500 focus:ring-0"
              rows={isExpanded ? 4 : 1}
              maxLength={1000}
            />
            
            {isExpanded && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {content.length}/1000 characters
                </span>
                
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;