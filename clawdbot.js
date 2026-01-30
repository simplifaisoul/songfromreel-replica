import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * ClawdBot - Intelligent Instagram Reel Scraper
 * Uses Puppeteer to scrape Instagram and extract audio for free
 */
class ClawdBot {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    /**
     * Initialize the browser
     */
    async init() {
        console.log('🤖 ClawdBot initializing...');

        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ]
        });

        this.page = await this.browser.newPage();

        // Set realistic user agent
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        console.log('✅ ClawdBot ready!');
    }

    /**
     * Scrape Instagram Reel and extract video URL
     * @param {string} url - Instagram Reel URL
     * @returns {Promise<Object>} Video data
     */
    async scrapeReel(url) {
        try {
            console.log('🔍 ClawdBot analyzing:', url);

            if (!this.browser) {
                await this.init();
            }

            // Navigate to the Reel
            await this.page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for video element to load
            await this.page.waitForSelector('video', { timeout: 10000 });

            // Extract video URL from the page
            const videoData = await this.page.evaluate(() => {
                const video = document.querySelector('video');
                const videoUrl = video?.src || video?.querySelector('source')?.src;

                // Try to get metadata
                const meta = {
                    title: document.querySelector('meta[property="og:title"]')?.content,
                    description: document.querySelector('meta[property="og:description"]')?.content,
                    image: document.querySelector('meta[property="og:image"]')?.content
                };

                return {
                    videoUrl,
                    ...meta
                };
            });

            console.log('✅ ClawdBot extracted video URL!');

            return {
                videoUrl: videoData.videoUrl,
                audioUrl: videoData.videoUrl, // Video contains audio
                thumbnail: videoData.image,
                title: videoData.title,
                description: videoData.description,
                success: true
            };

        } catch (error) {
            console.error('❌ ClawdBot error:', error.message);
            throw new Error(`ClawdBot failed to scrape: ${error.message}`);
        }
    }

    /**
     * Alternative method: Parse HTML directly without browser
     * @param {string} url - Instagram Reel URL
     * @returns {Promise<Object>} Video data
     */
    async scrapeLightweight(url) {
        try {
            console.log('🔍 ClawdBot (lightweight) analyzing:', url);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://www.instagram.com/'
                }
            });

            const $ = cheerio.load(response.data);

            // Extract video URL from script tags
            const scripts = $('script[type="application/ld+json"]').toArray();

            for (const script of scripts) {
                try {
                    const data = JSON.parse($(script).html());
                    if (data.video && data.video.contentUrl) {
                        console.log('✅ ClawdBot found video URL!');
                        return {
                            videoUrl: data.video.contentUrl,
                            audioUrl: data.video.contentUrl,
                            thumbnail: data.video.thumbnailUrl,
                            success: true
                        };
                    }
                } catch (e) {
                    continue;
                }
            }

            // Fallback: Try to find video URL in page source
            const videoMatch = response.data.match(/"video_url":"([^"]+)"/);
            if (videoMatch) {
                const videoUrl = videoMatch[1].replace(/\\u0026/g, '&');
                console.log('✅ ClawdBot extracted video URL from source!');
                return {
                    videoUrl,
                    audioUrl: videoUrl,
                    success: true
                };
            }

            throw new Error('Could not find video URL in page');

        } catch (error) {
            console.error('❌ ClawdBot lightweight error:', error.message);
            throw error;
        }
    }

    /**
     * Close the browser
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('👋 ClawdBot shutting down');
        }
    }
}

// Singleton instance
let clawdBotInstance = null;

/**
 * Get or create ClawdBot instance
 */
export async function getClawdBot() {
    if (!clawdBotInstance) {
        clawdBotInstance = new ClawdBot();
    }
    return clawdBotInstance;
}

/**
 * Scrape Instagram Reel using ClawdBot
 * @param {string} url - Instagram Reel URL
 * @returns {Promise<Object>} Video data
 */
export async function scrapeInstagramReel(url) {
    const bot = await getClawdBot();

    try {
        // Try lightweight method first (faster)
        return await bot.scrapeLightweight(url);
    } catch (error) {
        console.log('⚠️  Lightweight method failed, trying full browser...');
        // Fallback to full browser scraping
        return await bot.scrapeReel(url);
    }
}

export default ClawdBot;
