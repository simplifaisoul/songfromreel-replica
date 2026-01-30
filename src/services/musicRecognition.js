// Music Recognition Service using AudD.io API
// Free tier: 100 requests/day
// Sign up at https://audd.io/ to get your API key

const AUDD_API_KEY = import.meta.env.VITE_AUDD_API_KEY || 'test';
const AUDD_API_URL = 'https://api.audd.io/';

/**
 * Recognize music from audio URL (including Instagram URLs)
 * @param {string} audioUrl - URL to the audio file or Instagram Reel URL
 * @returns {Promise<Object>} Song information
 */
export async function recognizeSong(audioUrl) {
    try {
        console.log('🎵 Attempting to recognize song from:', audioUrl);

        const formData = new FormData();
        formData.append('url', audioUrl);
        formData.append('return', 'spotify,apple_music,deezer');
        formData.append('api_token', AUDD_API_KEY);

        const response = await fetch(AUDD_API_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        console.log('📊 AudD.io response:', data);

        if (data.status === 'success' && data.result) {
            console.log('✅ Song recognized!');
            return formatSongData(data.result);
        } else {
            const errorMsg = data.error?.error_message || 'Song not recognized';
            console.error('❌ Recognition failed:', errorMsg);

            // Provide helpful error messages
            if (errorMsg.includes('audio')) {
                throw new Error(
                    'Could not extract audio from this Reel.\n\n' +
                    'Try:\n' +
                    '1. A different Instagram Reel\n' +
                    '2. Downloading the Reel and uploading the audio file\n' +
                    '3. Using Shazam or SoundHound on your phone'
                );
            }

            throw new Error(errorMsg);
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
        console.log('🎵 Recognizing song from uploaded file:', audioFile.name);

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
            console.log('✅ Song recognized from file!');
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
