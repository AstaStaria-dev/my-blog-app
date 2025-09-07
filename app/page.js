// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import BlogCard from '../components/BlogCard';
import BlogForm from '../components/BlogForm';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Create or update post
  const handleSubmit = async (postData) => {
    try {
      if (editingPost) {
        // Update existing post
        await updateDoc(doc(db, 'posts', editingPost.id), {
          ...postData,
          updatedAt: serverTimestamp()
        });
        setEditingPost(null);
      } else {
        // Create new post
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

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

  // Edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400">
              My Blog
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2">
                Home
              </Link>
              <Link href="/blogs" className="text-gray-300 hover:text-white px-3 py-2">
                All Blogs
              </Link>
              <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to My Blog</h1>
          <p className="text-gray-400">Share your thoughts with the world</p>
        </div>

        {/* Blog Form */}
        <div className="mb-8">
          <BlogForm
            onSubmit={handleSubmit}
            editingPost={editingPost}
            onCancel={handleCancel}
          />
        </div>

        {/* Recent Posts Preview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Posts</h2>
            <Link href="/blogs" className="text-blue-400 hover:text-blue-300">
              View All Posts →
            </Link>
          </div>
          
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No blog posts yet. Create your first post above!</p>
              </div>
            ) : (
              posts.slice(0, 3).map(post => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
