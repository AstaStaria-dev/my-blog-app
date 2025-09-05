import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, User, Search, Menu, X } from 'lucide-react';

const BlogApp = () => {
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        title: "Getting Started with React",
        content: "React is a powerful JavaScript library for building user interfaces. In this post, we'll explore the fundamentals of React components, state management, and hooks. React makes it easy to create interactive UIs by breaking down complex interfaces into reusable components.\n\nOne of the key benefits of React is its virtual DOM, which optimizes rendering performance by only updating the parts of the page that have changed. This makes React applications fast and responsive, even with complex user interfaces.",
        author: "Jane Doe",
        timestamp: new Date('2024-01-15T10:30:00').toISOString()
      },
      {
        id: 2,
        title: "Modern Web Design Principles",
        content: "Creating beautiful and functional web experiences requires understanding key design principles. Mobile-first design ensures your applications work seamlessly across all devices. Clean typography, thoughtful color schemes, and intuitive navigation are essential elements.\n\nResponsive design isn't just about making things fit on smaller screens – it's about creating optimal experiences for each device type. This includes considering touch interactions, loading performance, and accessibility for all users.",
        author: "John Smith",
        timestamp: new Date('2024-01-20T14:45:00').toISOString()
      }
    ];
    setPosts(samplePosts);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.author) return;

    if (editingPost) {
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData, timestamp: new Date().toISOString() }
          : post
      ));
      setEditingPost(null);
    } else {
      const newPost = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString()
      };
      setPosts([newPost, ...posts]);
    }

    setFormData({ title: '', content: '', author: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author
    });
    setIsCreateModalOpen(true);
    setSelectedPost(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    setSelectedPost(null);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const PostModal = ({ post, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center rounded-t-2xl">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User size={16} />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(post.timestamp)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => handleEdit(post)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Edit size={16} />
              Edit Post
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter post title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter author name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical"
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {editingPost ? 'Update Post' : 'Create Post'}
            </button>
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingPost(null);
                setFormData({ title: '', content: '', author: '' });
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ModernBlog
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Plus size={20} />
                New Post
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <Plus size={20} />
                  New Post
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'No posts found' : 'No blog posts yet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first blog post'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Create Your First Post
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(post.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(post);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {isCreateModalOpen && <CreateEditModal />}
      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default BlogApp;