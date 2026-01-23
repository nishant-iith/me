import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, Clock, ExternalLink } from 'lucide-react';
import { useBlogPosts, usePrefetchBlogPost, HashnodePost } from '../features/blog';

// Your Hashnode publication host
const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

const Blog: React.FC = () => {
    const { data: posts } = useBlogPosts(10);
    const prefetchPost = usePrefetchBlogPost();


    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-4">
                <h2 className="font-mono text-lg text-zinc-200">Blog</h2>
                <a
                    href={`https://${HASHNODE_HOST}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                    View on Hashnode <ExternalLink size={10} />
                </a>
            </div>

            {/* Blog Posts List */}
            <div className="flex flex-col gap-4">
                {posts.length === 0 ? (
                    <p className="font-mono text-zinc-500 text-sm">No posts yet. Check back soon!</p>
                ) : (
                    posts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            onMouseEnter={() => prefetchPost(post.slug)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

interface BlogCardProps {
    post: HashnodePost;
    onMouseEnter: () => void;
}

const BlogCard: React.FC<BlogCardProps> = memo(({ post, onMouseEnter }) => {
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Link
            to={`/blog/${post.slug}`}
            onMouseEnter={onMouseEnter}
            className="group block p-5 border border-dashed border-zinc-800 rounded-sm bg-black/20 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300"
        >
            <div className="flex flex-col gap-3">
                {/* Title & Arrow */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-mono text-base font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h3>
                    <ArrowRight size={16} className="text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {post.brief}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-zinc-600">
                        <Calendar size={12} />
                        <span className="font-mono text-[10px]">{date}</span>
                    </div>

                    {/* Read Time */}
                    <div className="flex items-center gap-1.5 text-zinc-600">
                        <Clock size={12} />
                        <span className="font-mono text-[10px]">{post.readTimeInMinutes} min read</span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Tag size={12} className="text-zinc-600" />
                            {post.tags.slice(0, 3).map((tag, i) => (
                                <span
                                    key={i}
                                    className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
});

BlogCard.displayName = 'BlogCard';

export default Blog;
