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

        if (data.fallback) {
            // If using fallback, we need an alternative approach
            throw new Error(
                'Instagram API access is restricted. Please try:\n' +
                '1. Using a different Reel URL\n' +
                '2. Checking if the Reel is public\n' +
                '3. Using a VPN if Instagram is blocking your region'
            );
        }

        return data;
    } catch (error) {
        console.error('Instagram fetch error:', error);

        // Check if backend server is running
        if (error.message.includes('fetch')) {
            throw new Error(
                'Backend server not running! Please start it with:\n' +
                'npm run server\n\n' +
                'Then refresh and try again.'
            );
        }

        throw new Error('Failed to fetch Instagram Reel. Make sure the Reel is public and the URL is correct.');
    }
}
