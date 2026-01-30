// Instagram Reel Service
// Fetches Instagram Reel data and extracts audio using backend proxy

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
 * Fetch Instagram Reel data and audio using backend proxy
 * @param {string} url - Instagram Reel URL
 * @returns {Promise<Object>} Reel data with audio URL
 */
export async function fetchInstagramReel(url) {
    try {
        const reelId = extractReelId(url);

        // Use local backend proxy to bypass CORS
        const proxyUrl = 'http://localhost:3001/api/instagram';

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || 'Failed to fetch Instagram Reel');
        }

        const data = await response.json();

        // Even if it's a fallback, we'll try to use the URL with AudD.io
        // AudD.io can sometimes extract audio from Instagram URLs directly
        if (data.fallback) {
            console.log('Using fallback method - will attempt direct URL recognition');
        }

        return data;
    } catch (error) {
        console.error('Instagram fetch error:', error);

        // Check if backend server is running
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            throw new Error(
                'Cannot connect to backend server!\n\n' +
                'Please make sure the backend is running:\n' +
                'npm run server\n\n' +
                'Then refresh and try again.'
            );
        }

        throw error;
    }
}
