import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

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

        // Method 1: Try using a free Instagram API service
        try {
            const apiUrl = `https://instagram-scraper-api2.p.rapidapi.com/v1/post_info?code_or_id_or_url=${reelId}`;

            // For demo purposes without RapidAPI key, we'll use an alternative free service
            // Using insta-fetcher (a free npm package approach)
            const alternativeUrl = `https://www.instagram.com/p/${reelId}/?__a=1`;

            console.log('🔄 Attempting to fetch from Instagram...');

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
            console.log('⚠️  Method 1 failed:', error.message);
        }

        // Method 2: Use a public Instagram downloader service
        try {
            console.log('🔄 Trying alternative method...');

            // Using a free public API (no auth required)
            const downloaderUrl = `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${reelId}/`;

            const response = await fetch(downloaderUrl);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Got data from oembed');

                // oEmbed doesn't provide video URL, but we can construct it
                return res.json({
                    videoUrl: `https://www.instagram.com/p/${reelId}/`,
                    audioUrl: `https://www.instagram.com/p/${reelId}/`,
                    thumbnail: data.thumbnail_url || null,
                    fallback: true,
                    message: 'Using fallback method - video URL may need manual extraction'
                });
            }
        } catch (error) {
            console.log('⚠️  Method 2 failed:', error.message);
        }

        // Method 3: Return the Instagram URL for client-side handling
        console.log('⚠️  All methods failed, returning fallback');

        return res.json({
            videoUrl: `https://www.instagram.com/p/${reelId}/`,
            audioUrl: `https://www.instagram.com/p/${reelId}/`,
            fallback: true,
            message: 'Instagram API is restricted. The app will attempt to use the Reel URL directly with AudD.io'
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
    console.log(`💡 Tip: This server bypasses CORS restrictions for Instagram API calls`);
});
