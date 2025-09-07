// components/BlogCard.js
export default function BlogCard({ post, onDelete, onEdit }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.toDate()).toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-white line-clamp-2">
          {post.title}
        </h2>
        <div className="flex gap-3 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(post)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-900/20 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
        {post.content}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          By {post.author}
        </span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
    </div>
  );
}