// app/blogs/page.js
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BlogCard from '../../components/BlogCard';
import Link from 'next/link';

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch posts from Firebase
  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    }
  };

  // Edit post (redirect to home page)
  const handleEdit = (post) => {
    // Store the editing post in localStorage and redirect to home
    localStorage.setItem('editingPost', JSON.stringify(post));
    window.location.href = '/';
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading all blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400">
              My Blog
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2">
                Home
              </Link>
              <Link href="/blogs" className="text-white px-3 py-2 border-b-2 border-blue-500">
                All Blogs
              </Link>
              <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 All Blog Posts</h1>
          <p className="text-gray-400 mb-6">Discover all the amazing content from our community</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search blogs by title, content, or author..."
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{posts.length}</div>
              <div className="text-gray-400 text-sm">Total Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{filteredPosts.length}</div>
              <div className="text-gray-400 text-sm">Showing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {new Set(posts.map(post => post.author)).size}
              </div>
              <div className="text-gray-400 text-sm">Authors</div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <p className="text-gray-400 text-lg mb-4">
                    No posts found for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-lg mb-4">No blog posts yet.</p>
                  <Link href="/" className="text-blue-400 hover:text-blue-300">
                    Create the first post →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  <div className="absolute -left-4 top-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                    #{index + 1}
                  </div>
                  <BlogCard
                    post={post}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}