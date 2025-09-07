// components/BlogForm.js
import { useState } from 'react';

export default function BlogForm({ onSubmit, editingPost, onCancel }) {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [author, setAuthor] = useState(editingPost?.author || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    onSubmit({ title, content, author });
    if (!editingPost) {
      setTitle('');
      setContent('');
      setAuthor('');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        {editingPost ? '✏️ Edit Post' : '✨ Create New Post'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            placeholder="Enter your blog title..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Author
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            placeholder="Your name..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 leading-relaxed"
            placeholder="Write your blog content here..."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {editingPost ? '💾 Update Post' : '🚀 Create Post'}
          </button>
          
          {editingPost && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}