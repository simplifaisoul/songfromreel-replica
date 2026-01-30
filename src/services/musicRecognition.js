// Music Recognition Service using AudD.io API
// Free tier: 100 requests/day
// Sign up at https://audd.io/ to get your API key

const AUDD_API_KEY = import.meta.env.VITE_AUDD_API_KEY || 'test';
const AUDD_API_URL = 'https://api.audd.io/';

/**
 * Recognize music from audio URL
 * @param {string} audioUrl - URL to the audio file
 * @returns {Promise<Object>} Song information
 */
export async function recognizeSong(audioUrl) {
    try {
        const formData = new FormData();
        formData.append('url', audioUrl);
        formData.append('return', 'spotify,apple_music,deezer');
        formData.append('api_token', AUDD_API_KEY);

        const response = await fetch(AUDD_API_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.status === 'success' && data.result) {
            return formatSongData(data.result);
        } else {
            throw new Error(data.error?.error_message || 'Song not recognized');
        }
    } catch (error) {
        console.error('Music recognition error:', error);
        throw error;
    }
}

/**
 * Recognize music from audio file
 * @param {File} audioFile - Audio file object
 * @returns {Promise<Object>} Song information
 */
export async function recognizeSongFromFile(audioFile) {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('return', 'spotify,apple_music,deezer');
        formData.append('api_token', AUDD_API_KEY);

        const response = await fetch(AUDD_API_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.status === 'success' && data.result) {
            return formatSongData(data.result);
        } else {
            throw new Error(data.error?.error_message || 'Song not recognized');
        }
    } catch (error) {
        console.error('Music recognition error:', error);
        throw error;
    }
}

/**
 * Format song data from API response
 * @param {Object} result - API result object
 * @returns {Object} Formatted song data
 */
function formatSongData(result) {
    return {
        title: result.title,
        artist: result.artist,
        album: result.album || null,
        artwork: result.spotify?.album?.images?.[0]?.url ||
            result.apple_music?.artwork?.url?.replace('{w}', '300').replace('{h}', '300') ||
            null,
        spotify: result.spotify?.external_urls?.spotify || null,
        apple_music: result.apple_music?.url || null,
        deezer: result.deezer?.link || null,
        youtube: result.title && result.artist
            ? `https://www.youtube.com/results?search_query=${encodeURIComponent(result.artist + ' ' + result.title)}`
            : null
    };
}

/**
 * Alternative: Use Shazam API via RapidAPI (also free tier available)
 */
export async function recognizeWithShazam(audioUrl) {
    // This would require a RapidAPI key
    // Implementation similar to above but with Shazam endpoint
    throw new Error('Shazam integration not implemented yet');
}
