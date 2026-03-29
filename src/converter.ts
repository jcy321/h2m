/**
 * HTML to Markdown Converter Module
 * 
 * Ported from /root/html-to-md.mjs CLI tool
 */

import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

// Conversion options interface
export interface ConvertOptions {
  headingStyle?: 'atx' | 'setext';
  hr?: string;
  bulletListMarker?: '-' | '*' | '+';
  codeBlockStyle?: 'indented' | 'fenced';
  fence?: '```' | '~~~';
  emDelimiter?: '*' | '_';
  strongDelimiter?: '**' | '__';
  linkStyle?: 'inlined' | 'referenced';
}

// Default options
const DEFAULT_OPTIONS: ConvertOptions = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
};

/**
 * Create a configured Turndown service instance
 */
export function createTurndownService(options: ConvertOptions = {}): TurndownService {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const turndownService = new TurndownService({
    headingStyle: mergedOptions.headingStyle,
    hr: mergedOptions.hr,
    bulletListMarker: mergedOptions.bulletListMarker,
    codeBlockStyle: mergedOptions.codeBlockStyle,
    fence: mergedOptions.fence,
    emDelimiter: mergedOptions.emDelimiter,
    strongDelimiter: mergedOptions.strongDelimiter,
    linkStyle: mergedOptions.linkStyle,
  });
  
  // Add GFM support (tables, strikethrough, task lists)
  turndownService.use(gfm);
  
  // Custom rule: Handle images with proper alt text
  turndownService.addRule('image', {
    filter: 'img',
    replacement: (content: string, node: TurndownService.Node) => {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || '';
      const title = node.getAttribute('title');
      const titlePart = title ? ` "${title}"` : '';
      return alt ? `![${alt}](${src}${titlePart})` : `![](${src})`;
    },
  });
  
  // Custom rule: Handle line breaks
  turndownService.addRule('break', {
    filter: 'br',
    replacement: () => '\n',
  });
  
  // Custom rule: Handle preformatted blocks
  turndownService.addRule('preformatted', {
    filter: 'pre',
    replacement: (content: string) => {
      return '\n```\n' + content + '\n```\n';
    },
  });
  
  return turndownService;
}

/**
 * Convert HTML string to Markdown
 */
export function htmlToMarkdown(html: string, options: ConvertOptions = {}): string {
  if (!html || typeof html !== 'string') {
    throw new Error('HTML input must be a non-empty string');
  }
  
  const turndownService = createTurndownService(options);
  return turndownService.turndown(html);
}

/**
 * Fetch HTML from URL and convert to Markdown
 */
export async function urlToMarkdown(url: string, options: ConvertOptions = {}): Promise<{ markdown: string; title?: string }> {
  if (!url || typeof url !== 'string') {
    throw new Error('URL must be a non-empty string');
  }
  
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }
  
  // Fetch HTML
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'H2M-Bot/1.0 (HTML to Markdown Converter)',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }
  
  const html = await response.text();
  
  // Extract title if possible
  let title: string | undefined;
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  const markdown = htmlToMarkdown(html, options);
  
  return { markdown, title };
}

// Default export
export default {
  htmlToMarkdown,
  urlToMarkdown,
  createTurndownService,
};