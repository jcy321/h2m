/**
 * Input validation utilities
 */

/**
 * Validate HTML input
 */
export function validateHtml(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('HTML must be a string');
  }
  
  const html = input.trim();
  
  if (!html) {
    throw new Error('HTML cannot be empty');
  }
  
  // Basic sanity check - should contain some HTML-like content
  if (!html.includes('<') && !html.includes('>')) {
    throw new Error('Input does not appear to be valid HTML');
  }
  
  return html;
}

/**
 * Validate URL input
 */
export function validateUrl(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('URL must be a string');
  }
  
  const url = input.trim();
  
  if (!url) {
    throw new Error('URL cannot be empty');
  }
  
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL must use http or https protocol');
    }
    
    return url;
  } catch (e) {
    throw new Error('Invalid URL format');
  }
}