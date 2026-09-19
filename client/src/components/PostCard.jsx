// client/src/components/PostCard.jsx

export function PostCard({ post }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
    </article>
  );
}