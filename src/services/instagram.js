// Instagram Reel Service
// Fetches Instagram Reel data and extracts audio

/**
 * Extract Instagram Reel ID from URL
 * @param {string} url - Instagram Reel URL
 * @returns {string} Reel ID
 */
function extractReelId(url) {
    const patterns = [
        /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/[\w.]+\/reel\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/[\w.]+\/p\/([A-Za-z0-9_-]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    throw new Error('Invalid Instagram URL');
}

/**
 * Fetch Instagram Reel data and audio
 * @param {string} url - Instagram Reel URL
 * @returns {Promise<Object>} Reel data with audio URL
 */
export async function fetchInstagramReel(url) {
    try {
        const reelId = extractReelId(url);

        // Using a free Instagram downloader API
        // Option 1: Use Instagram's oEmbed API (limited info)
        const oembedUrl = `https://graph.instagram.com/oembed?url=${encodeURIComponent(url)}`;

        try {
            const response = await fetch(oembedUrl);
            const data = await response.json();

            // oEmbed doesn't provide audio, so we need to use a downloader service
            // For now, we'll use a public API endpoint
            return await fetchReelWithDownloader(reelId, url);
        } catch (error) {
            // Fallback to downloader
            return await fetchReelWithDownloader(reelId, url);
        }
    } catch (error) {
        console.error('Instagram fetch error:', error);
        throw new Error('Failed to fetch Instagram Reel. Make sure the Reel is public and the URL is correct.');
    }
}

/**
 * Fetch Reel using a downloader service
 * @param {string} reelId - Instagram Reel ID
 * @param {string} url - Original URL
 * @returns {Promise<Object>} Reel data
 */
async function fetchReelWithDownloader(reelId, url) {
    // Using a free Instagram downloader API
    // Note: These services may have rate limits

    // Option 1: Use a CORS proxy + Instagram's public API
    const apiUrl = `https://www.instagram.com/p/${reelId}/?__a=1&__d=dis`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Instagram');
        }

        const data = await response.json();
        const videoUrl = data.items?.[0]?.video_url || data.graphql?.shortcode_media?.video_url;

        if (!videoUrl) {
            throw new Error('Could not extract video URL');
        }

        return {
            videoUrl,
            audioUrl: videoUrl, // Video URL contains audio
            thumbnail: data.items?.[0]?.image_versions2?.candidates?.[0]?.url || null
        };
    } catch (error) {
        // Fallback: Use a third-party API service
        // For demo purposes, we'll throw an error with instructions
        throw new Error(
            'Instagram API access is restricted. For a working demo, you can:\n' +
            '1. Use the file upload feature (if implemented)\n' +
            '2. Set up a backend proxy server\n' +
            '3. Use RapidAPI Instagram Downloader (free tier available)'
        );
    }
}

/**
 * Alternative: Use RapidAPI Instagram Downloader
 * Requires VITE_RAPIDAPI_KEY environment variable
 */
export async function fetchReelWithRapidAPI(url) {
    const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

    if (!RAPIDAPI_KEY) {
        throw new Error('RapidAPI key not configured');
    }

    try {
        const response = await fetch('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            },
            params: {
                url: url
            }
        });

        const data = await response.json();

        return {
            videoUrl: data.video_url,
            audioUrl: data.video_url,
            thumbnail: data.thumbnail
        };
    } catch (error) {
        console.error('RapidAPI error:', error);
        throw error;
    }
}
