import { describe, it, expect } from 'bun:test';
import { htmlToMarkdown, urlToMarkdown, createTurndownService } from '../src/converter';

describe('htmlToMarkdown', () => {
  it('should convert basic HTML', () => {
    const html = '<h1>Hello World</h1>';
    const result = htmlToMarkdown(html);
    expect(result).toBe('# Hello World');
  });

  it('should convert paragraphs', () => {
    const html = '<p>This is a paragraph.</p>';
    const result = htmlToMarkdown(html);
    expect(result).toBe('This is a paragraph.');
  });

  it('should convert bold and italic', () => {
    const html = '<p>This is <strong>bold</strong> and <em>italic</em>.</p>';
    const result = htmlToMarkdown(html);
    expect(result).toBe('This is **bold** and *italic*.');
  });

  it('should convert links', () => {
    const html = '<a href="https://example.com">Example</a>';
    const result = htmlToMarkdown(html);
    expect(result).toBe('[Example](https://example.com)');
  });

  it('should convert images', () => {
    const html = '<img src="image.png" alt="Alt text">';
    const result = htmlToMarkdown(html);
    expect(result).toBe('![Alt text](image.png)');
  });

  it('should convert unordered lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('-   Item 1');
    expect(result).toContain('-   Item 2');
  });

  it('should convert tables (GFM)', () => {
    const html = '<table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>Test</td><td>123</td></tr></tbody></table>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('| Name | Value |');
    expect(result).toContain('| Test | 123 |');
  });

  it('should convert code blocks', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```');
    expect(result).toContain('const x = 1;');
  });

  it('should throw on empty input', () => {
    expect(() => htmlToMarkdown('')).toThrow();
    expect(() => htmlToMarkdown(null as any)).toThrow();
  });
});

describe('createTurndownService', () => {
  it('should create a Turndown service with GFM support', () => {
    const service = createTurndownService();
    expect(service).toBeDefined();
  });

  it('should accept custom options', () => {
    const service = createTurndownService({
      headingStyle: 'atx',
      bulletListMarker: '*',
    });
    expect(service).toBeDefined();
  });
});