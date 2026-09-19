// client/src/components/Feed.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "./PostCard";

export function Feed() {
  const [posts, setPosts] = useState(null); // null = loading (Section 4.6: visibility of system status)

  useEffect(() => {
    fetch("/api/posts?page=1")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  if (posts === null) {
    return <div className="text-gray-500 py-8">Loading posts…</div>;
  }

  if (posts.length === 0) {
    // Lecture 3, Browse Feed extension 2a: an explicit empty state, not a blank screen.
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No posts yet.</p>
        <Link 
          to="/write" 
          className="text-blue-600 hover:underline font-medium"
        >
          Write the first one
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}