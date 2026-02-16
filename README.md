# Portfolio Website

Personal portfolio of **Nishant Verma** - a Software Engineer and student at IIT Hyderabad.

![Portfolio](https://img.shields.io/badge/portfolio-live-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Dark-themed UI** with monospace aesthetics
- **GitHub Contributions** integration
- **LeetCode & Codeforces Stats** display
- **AI Chat Widget** with Cloudflare Workers
- **Blog** with MDX support
- **Visitor Counter** via Cloudflare Workers
- **Command Palette** (Cmd+K)
- **Responsive Design**

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **Styling**: Tailwind CSS 4, MUI v7
- **State Management**: React Context, TanStack Query
- **Routing**: React Router v7
- **Backend**: Cloudflare Workers (Edge)
- **Deployment**: Vercel

## Getting Started

```bash
# Clone the repository
git clone https://github.com/nishant-iith/me.git
cd me

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_BLOG_API_URL=your_blog_api_url
VITE_LEETCODE_API_URL=your_leetcode_api_url
VITE_CHATBOT_API_URL=your_chatbot_api_url
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/        # Feature-based modules (blog, github, leetcode, etc.)
├── hooks/          # Custom React hooks
├── pages/          # Route pages
├── providers/      # React context providers
├── utils/          # Utility functions
└── assets/         # Static assets
```

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Manual Build

```bash
npm run build
# Output in dist/
```

## Cloudflare Workers

The project includes three Cloudflare Workers:

- `worker/view-counter.js` - Visitor counting
- `worker/blog-proxy.js` - Blog API proxy
- `worker/chatbot-api.js` - AI chatbot backend

Deploy with Wrangler:

```bash
wrangler deploy worker/view-counter.js
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using React & Tailwind CSS
