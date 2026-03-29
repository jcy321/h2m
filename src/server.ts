/**
 * H2M Server - HTML to Markdown Converter
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { htmlToMarkdown, urlToMarkdown } from './converter';
import { validateHtml, validateUrl } from './utils/validators';

// Create app
const app = new Hono();

// Enable CORS
app.use('*', cors());

// Serve static files
app.use('/*', serveStatic({ root: './public' }));

// API Routes
app.post('/api/convert', async (c) => {
  try {
    const body = await c.req.json();
    const html = validateHtml(body.html);
    const markdown = htmlToMarkdown(html);
    
    return c.json({ markdown });
  } catch (error) {
    return c.json({ 
      error: error instanceof Error ? error.message : 'Conversion failed' 
    }, 400);
  }
});

app.post('/api/fetch', async (c) => {
  try {
    const body = await c.req.json();
    const url = validateUrl(body.url);
    const result = await urlToMarkdown(url);
    
    return c.json({ 
      markdown: result.markdown,
      title: result.title,
    });
  } catch (error) {
    return c.json({ 
      error: error instanceof Error ? error.message : 'Fetch failed' 
    }, 400);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// 404 handler
app.notFound((c) => {
  return c.text('Not Found', 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Start server
const port = Number(process.env.PORT) || 3000;

console.log(`
╔════════════════════════════════════════╗
║     H2M - HTML to Markdown Converter   ║
╚════════════════════════════════════════╝

🚀 Server running at http://localhost:${port}
📝 API Endpoints:
   POST /api/convert  - Convert HTML to Markdown
   POST /api/fetch    - Fetch URL and convert to Markdown
   GET  /health       - Health check
`);

export default {
  port,
  fetch: app.fetch,
};