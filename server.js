const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure data directory and enquiries storage file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf8');
}

// MIME Type Mapper
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.m4v': 'video/mp4',
    '.webm': 'video/webm',
    '.ogv': 'video/ogg',
    '.mov': 'video/quicktime',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Media served with byte-range support so the hero video streams and seeks
const STREAMABLE = new Set(['.mp4', '.m4v', '.webm', '.ogv', '.mov']);

// Assets safe to cache in the browser (never the HTML/CSS/JS shell)
const CACHEABLE = new Set([
    '.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.pdf',
    '.mp4', '.m4v', '.webm', '.ogv', '.mov', '.woff', '.woff2'
]);

// Clean document routes -> single page app shell
const APP_ROUTES = new Set(['/gst', '/wireman-license']);

const server = http.createServer((req, res) => {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // ============================================================
    // BACKEND API ROUTES
    // ============================================================

    // GET /api/health
    if (req.method === 'GET' && pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ONLINE',
            business: 'AAISAHEB ELECTRICALS',
            owner: 'Rupesh Baburao Ughade',
            location: 'Kothrud, Pune, Maharashtra, India',
            phone: '8767814553',
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // GET /api/enquiries
    if (req.method === 'GET' && pathname === '/api/enquiries') {
        try {
            const data = fs.readFileSync(ENQUIRIES_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read enquiries' }));
        }
        return;
    }

    // POST /api/enquiry
    if (req.method === 'POST' && pathname === '/api/enquiry') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const enquiryData = JSON.parse(body);
                const { name, phone, email, projectType, location, requirement } = enquiryData;

                if (!name || !phone || !projectType || !location || !requirement) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'All required fields must be filled.' }));
                    return;
                }

                const newEnquiry = {
                    id: 'AE-' + Date.now().toString(36).toUpperCase(),
                    name,
                    phone,
                    email: email || 'N/A',
                    projectType,
                    location,
                    requirement,
                    createdAt: new Date().toISOString()
                };

                // Read existing and append
                const existingData = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf8'));
                existingData.push(newEnquiry);
                fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(existingData, null, 2), 'utf8');

                console.log(`[BACKEND LOG] New Enquiry Saved: ${newEnquiry.id} from ${newEnquiry.name} (${newEnquiry.phone})`);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Enquiry submitted successfully! Aaisaheb Electricals will contact you shortly.',
                    enquiryId: newEnquiry.id
                }));

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
        });
        return;
    }

    // ============================================================
    // FRONTEND STATIC FILE SERVER
    // ============================================================
    // Clean routes (/gst, /wireman-license) resolve to the app shell;
    // the client script opens the matching document viewer.
    const routeKey = pathname.replace(/\/+$/, '') || '/';
    const isAppRoute = pathname === '/' || APP_ROUTES.has(routeKey);

    let filePath = path.join(PUBLIC_DIR, isAppRoute ? 'index.html' : pathname);

    // Normalize path to prevent directory traversal
    const safePath = path.normalize(filePath);
    if (!safePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    const cacheHeader = CACHEABLE.has(extname)
        ? 'public, max-age=604800'
        : 'no-cache, no-store, must-revalidate';

    // Stream video with HTTP range support so playback starts immediately
    if (STREAMABLE.has(extname)) {
        fs.stat(safePath, (statErr, stats) => {
            if (statErr) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
                return;
            }

            const total = stats.size;
            const range = req.headers.range;

            if (range) {
                const match = /bytes=(\d*)-(\d*)/.exec(range);
                const start = match && match[1] ? parseInt(match[1], 10) : 0;
                const end = match && match[2] ? parseInt(match[2], 10) : total - 1;

                if (isNaN(start) || start >= total || end >= total || start > end) {
                    res.writeHead(416, { 'Content-Range': `bytes */${total}` });
                    res.end();
                    return;
                }

                res.writeHead(206, {
                    'Content-Type': contentType,
                    'Content-Range': `bytes ${start}-${end}/${total}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': end - start + 1,
                    'Cache-Control': cacheHeader
                });
                fs.createReadStream(safePath, { start, end }).pipe(res);
                return;
            }

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': total,
                'Accept-Ranges': 'bytes',
                'Cache-Control': cacheHeader
            });
            fs.createReadStream(safePath).pipe(res);
        });
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The requested page could not be found.</p>');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': cacheHeader
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`
============================================================
⚡ AAISAHEB ELECTRICALS — FULLSTACK SERVER ONLINE
============================================================
Owner: Rupesh Baburao Ughade (8767814553)
Location: Pune, Maharashtra, India

🌐 Web App Frontend: http://localhost:${PORT}
⚡ Health Check API: http://localhost:${PORT}/api/health
📩 Enquiries GET API: http://localhost:${PORT}/api/enquiries
📩 Enquiry POST API: http://localhost:${PORT}/api/enquiry
============================================================
`);
});
