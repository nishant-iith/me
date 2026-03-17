import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: string;
  robots?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSEO({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const BASE_URL = 'https://nishant-sde.pages.dev';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.svg`;

export function SEO({
  title = 'Nishant Verma - Software Engineer',
  description = 'Personal portfolio of Nishant Verma - Software Engineer and student at IIT Hyderabad. Showcasing projects, skills, and experience.',
  pathname = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index, follow',
  article
}: SEOProps) {
  const canonicalUrl = `${BASE_URL}${pathname}`;
  const isNoIndex = robots.includes('noindex');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {!isNoIndex && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Nishant Verma Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={image !== DEFAULT_IMAGE ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@nishant_iith" />

      {/* Article-specific OG tags */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.tags?.map((tag, index) => <meta key={`tag-${index}-${tag}`} property="article:tag" content={tag} />)}

      {/* Additional SEO */}
      <meta name="author" content="Nishant Verma" />
      <meta name="robots" content={robots} />
      {!isNoIndex && <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />}
    </Helmet>
  );
}

// Pre-configured SEO for specific routes
export const HomeSEO = () => (
  <>
    <SEO
      title="Nishant Verma - Software Engineer | IIT Hyderabad"
      description="Software Engineer joining DP World in July 2026. B.Tech at IIT Hyderabad with experience at Goldman Sachs. Building scalable web applications and competitive programming."
      pathname="/"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Nishant Verma",
        "url": "https://nishant-sde.pages.dev",
        "email": "nishant.iith@gmail.com",
        "image": "https://nishant-sde.pages.dev/og-image.png",
        "jobTitle": "Software Engineering Student",
        "worksFor": { "@type": "Organization", "name": "DP World" },
        "affiliation": { "@type": "EducationalOrganization", "name": "IIT Hyderabad", "sameAs": "https://www.iith.ac.in" },
        "alumniOf": { "@type": "EducationalOrganization", "name": "IIT Hyderabad", "sameAs": "https://www.iith.ac.in" },
        "sameAs": [
          "https://github.com/nishant-iith",
          "https://linkedin.com/in/nishant-iith",
          "https://codeforces.com/profile/so-called-iitian"
        ],
        "knowsAbout": ["Software Engineering", "Competitive Programming", "Web Development", "Machine Learning", "React", "TypeScript", "Node.js", "C++", "Python"],
        "description": "Software Engineer joining DP World in July 2026. B.Tech at IIT Hyderabad with experience at Goldman Sachs."
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Nishant Verma Portfolio",
        "url": "https://nishant-sde.pages.dev",
        "description": "Personal portfolio of Nishant Verma - Software Engineer and student at IIT Hyderabad",
        "author": { "@type": "Person", "name": "Nishant Verma" }
      })}</script>
    </Helmet>
  </>
);

export const AboutSEO = () => (
  <SEO
    title="About Nishant Verma — IITH Student | Software Engineer"
    description="About Nishant Verma, IIT Hyderabad student and Software Engineer. Joining DP World in July 2026 after a Goldman Sachs internship. Passionate about building things that look good and work even better."
    pathname="/about"
  />
);

export const SkillSEO = () => (
  <SEO
    title="Skills & Tech Stack | Nishant Verma"
    description="Full-stack developer skilled in React, TypeScript, Node.js, C++, Python, and more. View my complete technical toolkit."
    pathname="/skill"
  />
);

export const BlogSEO = () => (
  <>
    <SEO
      title="Blog | Nishant Verma"
      description="Technical articles and insights on software engineering, competitive programming, and system design."
      pathname="/blog"
    />
    <BreadcrumbSEO items={[
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` }
    ]} />
  </>
);

export interface BlogPostSEOProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
}

export const BlogPostSEO = ({ title, description, slug, publishedAt, coverImage, tags }: BlogPostSEOProps) => (
  <>
    <SEO
      title={`${title} | Nishant Verma`}
      description={description}
      pathname={`/blog/${slug}`}
      image={coverImage}
      type="article"
      article={{
        publishedTime: publishedAt,
        author: 'Nishant Verma',
        tags
      }}
    />
    <BreadcrumbSEO items={[
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` },
      { name: title, url: `${BASE_URL}/blog/${slug}` }
    ]} />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "url": `${BASE_URL}/blog/${slug}`,
        "datePublished": publishedAt,
        "author": { "@type": "Person", "name": "Nishant Verma", "url": BASE_URL },
        ...(coverImage && { "image": coverImage }),
        "publisher": {
          "@type": "Person",
          "name": "Nishant Verma",
          "url": BASE_URL
        }
      })}</script>
    </Helmet>
  </>
);

export const ToolboxSEO = () => (
  <SEO
    title="My Toolbox | Nishant Verma"
    description="The software, hardware, and tools I use daily for development. From IntelliJ IDEA to MacBook Pro M1."
    pathname="/toolbox"
  />
);

export const TimelineSEO = () => (
  <SEO
    title="Journey & Timeline | Nishant Verma"
    description="A chronological log of my journey - from joining IIT Hyderabad to Goldman Sachs internship and upcoming role at DP World."
    pathname="/timeline"
  />
);

export const BooksSEO = () => (
  <SEO
    title="Reading List | Nishant Verma"
    description="Computer science books that shaped my understanding - from SICP to Designing Data-Intensive Applications."
    pathname="/books"
  />
);

export const SnippetsSEO = () => (
  <SEO
    title="Code Snippets | Nishant Verma"
    description="Useful code snippets and templates for competitive programming and development."
    pathname="/snippets"
  />
);

export const ChatSEO = () => (
  <SEO
    title="Chat with AI Nishant | Nishant Verma"
    description="Chat with an AI version of me. Ask about my experience, skills, or just say hi!"
    pathname="/chat"
    robots="noindex, nofollow"
  />
);

export const NotFoundSEO = () => (
  <SEO
    title="404 - Page Not Found | Nishant Verma"
    description="The page you're looking for doesn't exist."
    pathname=""
    robots="noindex, follow"
  />
);
