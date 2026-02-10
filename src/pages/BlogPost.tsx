import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useBlogPost } from '../features/blog/hooks/useBlogHooks';

// Your Hashnode publication host
const HASHNODE_HOST = 'lets-learn-cs.hashnode.dev';

const BlogPost = () => {
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

    // Sanitize HTML content to prevent XSS with strict allowlist
    // Note: iframe support removed for security - prevents clickjacking and malicious content injection
    const sanitizedHtml = DOMPurify.sanitize(post.content?.html || '', {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
            'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
            'a', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'sub', 'sup',
            'img', 'figure', 'figcaption', 'picture', 'source',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
            'div', 'span', 'section', 'article', 'details', 'summary',
            'mark', 'abbr', 'cite', 'kbd', 'var', 'samp', 'dl', 'dt', 'dd',
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
            'class', 'id', 'loading', 'decoding',
            'colspan', 'rowspan', 'scope',
            'open', 'type', 'start',
        ],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
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
                            {post.tags.map((tag) => (
                                <span
                                    key={tag.name}
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
