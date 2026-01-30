import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Proxy endpoint for Instagram Reels
app.post('/api/instagram', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Extract Reel ID
        const reelIdMatch = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
        if (!reelIdMatch) {
            return res.status(400).json({ error: 'Invalid Instagram URL' });
        }

        const reelId = reelIdMatch[1];

        // Fetch from Instagram with proper headers
        const instagramUrl = `https://www.instagram.com/p/${reelId}/?__a=1&__d=dis`;

        const response = await fetch(instagramUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.instagram.com/',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            // Fallback: Try to get video URL using alternative method
            return res.status(200).json({
                videoUrl: `https://www.instagram.com/p/${reelId}/`,
                audioUrl: `https://www.instagram.com/p/${reelId}/`,
                fallback: true,
                message: 'Using fallback method. You may need to use a third-party service.'
            });
        }

        const data = await response.json();
        const videoUrl = data.items?.[0]?.video_url ||
            data.graphql?.shortcode_media?.video_url ||
            `https://www.instagram.com/p/${reelId}/`;

        res.json({
            videoUrl,
            audioUrl: videoUrl,
            thumbnail: data.items?.[0]?.image_versions2?.candidates?.[0]?.url || null
        });

    } catch (error) {
        console.error('Instagram proxy error:', error);
        res.status(500).json({
            error: 'Failed to fetch Instagram data',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Instagram proxy server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Instagram proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Frontend should connect to: http://localhost:${PORT}/api/instagram`);
});
