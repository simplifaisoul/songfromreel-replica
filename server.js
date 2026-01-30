import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { scrapeInstagramReel } from './clawdbot.js';

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Proxy endpoint for Instagram Reels using multiple fallback methods
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

        console.log(`📥 Fetching Instagram Reel: ${reelId}`);
        console.log(`🤖 Activating ClawdBot - Intelligent Instagram Scraper`);

        // Method 1: Use ClawdBot (Puppeteer-based scraper)
        try {
            const reelData = await scrapeInstagramReel(url);

            if (reelData.success) {
                console.log('✅ ClawdBot successfully scraped the Reel!');
                return res.json(reelData);
            }
        } catch (clawdError) {
            console.log('⚠️  ClawdBot failed:', clawdError.message);
            console.log('🔄 Trying fallback methods...');
        }

        // Method 2: Try using Instagram's API directly
        try {
            const alternativeUrl = `https://www.instagram.com/p/${reelId}/?__a=1`;

            console.log('🔄 Attempting direct API fetch...');

            const response = await fetch(alternativeUrl, {
                headers: {
                    'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate',
                    'X-IG-App-ID': '936619743392459',
                    'X-IG-WWW-Claim': '0',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': 'https://www.instagram.com/',
                    'Origin': 'https://www.instagram.com'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Successfully fetched from Instagram');

                const videoUrl = data.graphql?.shortcode_media?.video_url ||
                    data.items?.[0]?.video_url;

                if (videoUrl) {
                    return res.json({
                        videoUrl,
                        audioUrl: videoUrl,
                        thumbnail: data.graphql?.shortcode_media?.display_url || null,
                        success: true
                    });
                }
            }
        } catch (error) {
            console.log('⚠️  Method 2 failed:', error.message);
        }

        // Method 3: Use oEmbed API
        try {
            console.log('🔄 Trying oEmbed method...');

            const downloaderUrl = `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${reelId}/`;

            const response = await fetch(downloaderUrl);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Got data from oembed');

                return res.json({
                    videoUrl: `https://www.instagram.com/p/${reelId}/`,
                    audioUrl: `https://www.instagram.com/p/${reelId}/`,
                    thumbnail: data.thumbnail_url || null,
                    fallback: true,
                    message: 'Using fallback method - video URL may need manual extraction'
                });
            }
        } catch (error) {
            console.log('⚠️  Method 3 failed:', error.message);
        }

        // Final fallback
        console.log('⚠️  All methods failed (including ClawdBot), returning fallback');

        return res.json({
            videoUrl: `https://www.instagram.com/p/${reelId}/`,
            audioUrl: `https://www.instagram.com/p/${reelId}/`,
            fallback: true,
            message: 'ClawdBot and all fallback methods failed. Instagram API is heavily restricted.'
        });

    } catch (error) {
        console.error('❌ Instagram proxy error:', error);
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
    console.log(`🤖 ClawdBot AI Agent: ACTIVE - Intelligent Instagram scraping enabled`);
    console.log(`💡 Tip: ClawdBot uses Puppeteer to bypass Instagram restrictions`);
});
