import React, { useState } from 'react';
import { Calendar, Mail, Edit, Check, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostCard from './PostCard';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { getUserPosts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const userPosts = user ? getUserPosts(user.id) : [];

  const handleSaveProfile = () => {
    if (editForm.name.trim()) {
      updateProfile({
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
        
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white font-bold text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="pt-4 flex justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="pt-16">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatJoinDate(user.joinedAt)}</span>
                  </div>
                </div>
                
                {user.bio && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {user.bio}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{userPosts.length} posts</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>
        
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Start sharing your thoughts with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;