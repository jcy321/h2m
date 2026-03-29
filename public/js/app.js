/**
 * H2M - HTML to Markdown Converter
 * Frontend Application
 */

// DOM Elements
const htmlInput = document.getElementById('html-input');
const urlInput = document.getElementById('url-input');
const markdownOutput = document.getElementById('markdown-output');
const convertBtn = document.getElementById('convert-btn');
const fetchBtn = document.getElementById('fetch-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const statusEl = document.getElementById('status');

// State
let currentMode = 'html';

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        switchMode(mode);
    });
});

function switchMode(mode) {
    currentMode = mode;
    
    // Update tabs
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update input areas
    document.getElementById('html-mode').classList.toggle('hidden', mode !== 'html');
    document.getElementById('url-mode').classList.toggle('hidden', mode !== 'url');
    
    // Update buttons
    convertBtn.classList.toggle('hidden', mode !== 'html');
    fetchBtn.classList.toggle('hidden', mode !== 'url');
    
    // Focus appropriate input
    if (mode === 'html') {
        htmlInput.focus();
    } else {
        urlInput.focus();
    }
}

// Convert HTML to Markdown
async function convertHtml() {
    const html = htmlInput.value.trim();
    
    if (!html) {
        showStatus('Please enter HTML content', 'error');
        return;
    }
    
    showStatus('Converting...', 'loading');
    convertBtn.disabled = true;
    
    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
        }
        
        const data = await response.json();
        markdownOutput.value = data.markdown;
        showStatus('Converted successfully', 'success');
    } catch (error) {
        showStatus(error.message, 'error');
    } finally {
        convertBtn.disabled = false;
    }
}

// Fetch URL and convert
async function fetchAndConvert() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showStatus('Please enter a URL', 'error');
        return;
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch {
        showStatus('Please enter a valid URL', 'error');
        return;
    }
    
    showStatus('Fetching...', 'loading');
    fetchBtn.disabled = true;
    
    try {
        const response = await fetch('/api/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Fetch failed');
        }
        
        const data = await response.json();
        markdownOutput.value = data.markdown;
        showStatus(`Fetched from: ${data.title || url}`, 'success');
    } catch (error) {
        showStatus(error.message, 'error');
    } finally {
        fetchBtn.disabled = false;
    }
}

// Copy to clipboard
async function copyMarkdown() {
    const markdown = markdownOutput.value;
    
    if (!markdown) {
        showStatus('Nothing to copy', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(markdown);
        showStatus('Copied to clipboard', 'success');
        
        // Visual feedback
        copyBtn.textContent = '✓ Copied';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    } catch (error) {
        showStatus('Failed to copy', 'error');
    }
}

// Clear all
function clearAll() {
    htmlInput.value = '';
    urlInput.value = '';
    markdownOutput.value = '';
    showStatus('', '');
}

// Show status message
function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status';
        }, 3000);
    }
}

// Example snippets
function loadExample(html) {
    htmlInput.value = html;
    switchMode('html');
    convertHtml();
}

// Event listeners
convertBtn.addEventListener('click', convertHtml);
fetchBtn.addEventListener('click', fetchAndConvert);
copyBtn.addEventListener('click', copyMarkdown);
clearBtn.addEventListener('click', clearAll);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (currentMode === 'html') {
            convertHtml();
        } else {
            fetchAndConvert();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    htmlInput.focus();
});

// Make loadExample available globally for onclick handlers
window.loadExample = loadExample;