# H2M - HTML to Markdown Converter

A minimalist, self-hosted HTML to Markdown converter web application.

![H2M Screenshot](https://via.placeholder.com/800x400/0a0a0b/00d4aa?text=H2M+-+HTML+to+Markdown)

## Features

- **HTML to Markdown Conversion** - Convert any HTML to clean Markdown
- **URL Fetch & Convert** - Fetch HTML from any URL and convert
- **GFM Support** - GitHub Flavored Markdown (tables, strikethrough, task lists)
- **Minimalist Design** - Clean, dark-themed interface (NO purple!)
- **Self-Hosted** - Deploy on your own server in minutes

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/jcy321/h2m.git
cd h2m

# Build and run
docker-compose up -d

# Open http://localhost:3000
```

### Option 2: Bun Runtime

```bash
# Prerequisites: Install Bun
# curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/jcy321/h2m.git
cd h2m
bun install

# Development mode
bun run dev

# Production mode
bun run build
bun run start
```

## API Endpoints

### POST /api/convert

Convert HTML to Markdown.

**Request:**
```json
{
  "html": "<h1>Hello</h1><p>This is <strong>bold</strong>.</p>"
}
```

**Response:**
```json
{
  "markdown": "# Hello\n\nThis is **bold**."
}
```

### POST /api/fetch

Fetch HTML from URL and convert to Markdown.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "markdown": "...",
  "title": "Example Domain"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev/) - Lightweight web framework
- **Conversion**: [Turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown library
- **GFM**: [turndown-plugin-gfm](https://github.com/mixmark-io/turndown-plugin-gfm) - GitHub Flavored Markdown support

## Project Structure

```
h2m/
├── src/
│   ├── server.ts          # Hono server entry point
│   ├── converter.ts       # Core conversion logic
│   └── utils/
│       └── validators.ts  # Input validation
├── public/
│   ├── index.html         # Main page
│   ├── css/
│   │   └── styles.css     # Styling
│   └── js/
│       └── app.js         # Frontend logic
├── tests/                 # Test files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── package.json           # Dependencies
└── README.md              # This file
```

## Development

```bash
# Run in development mode with hot reload
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## Deployment

### Docker

```bash
# Build image
docker build -t h2m .

# Run container
docker run -p 3000:3000 h2m
```

### Manual

```bash
# Build
bun run build

# Start with environment variables
PORT=8080 bun run start
```

## Keyboard Shortcuts

- `Ctrl` + `Enter` - Convert current input

## License

GNU Affero General Public License v3.0 (AGPL-3.0) - See [LICENSE](LICENSE) for details.

> ⚠️ **Note**: AGPL-3.0 requires that any modifications to this software, even when run as a network service, must be made available to users under the same license.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ by [jcy321](https://github.com/jcy321)