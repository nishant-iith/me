import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useBlogPost } from '../features/blog';

// Your Hashnode publication host
const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: post } = useBlogPost(slug!);

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <h2 className="font-mono text-xl text-zinc-300">Post not found</h2>
                <Link
                    to="/blog"
                    className="font-mono text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                    <ArrowLeft size={14} />
                    Back to Blog
                </Link>
            </div>
        );
    }
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Sanitize HTML content to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(post.content?.html || '', {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Back Link */}
            <div className="flex items-center justify-between">
                <Link
                    to="/blog"
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Blog
                </Link>
                <a
                    href={`https://${HASHNODE_HOST}/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors"
                >
                    View on Hashnode <ExternalLink size={12} />
                </a>
            </div>

            {/* Post Header */}
            <header className="border-b border-dashed border-zinc-800 pb-6">
                <h1 className="font-doto text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar size={12} />
                        <span className="font-mono text-[10px]">{date}</span>
                    </div>

                    {/* Read Time */}
                    <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock size={12} />
                        <span className="font-mono text-[10px]">{post.readTimeInMinutes} min read</span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Tag size={12} className="text-zinc-500" />
                            {post.tags.map((tag, i: number) => (
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
            </header>

            {/* Cover Image */}
            {post.coverImage?.url && (
                <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full rounded-lg border border-zinc-800"
                />
            )}

            {/* Sanitized HTML Content */}
            <article
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
        </div>
    );
};

export default BlogPost;
