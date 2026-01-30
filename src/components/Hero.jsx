import { useState } from 'react';
import './Hero.css';

export default function Hero({ onSearch, isLoading }) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const validateInstagramUrl = (url) => {
        const patterns = [
            /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[\w-]+/,
            /^https?:\/\/(www\.)?instagram\.com\/[\w.]+\/(reel|p)\/[\w-]+/
        ];
        return patterns.some(pattern => pattern.test(url));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter an Instagram Reel URL');
            return;
        }

        if (!validateInstagramUrl(url)) {
            setError('Please enter a valid Instagram Reel or Post URL');
            return;
        }

        onSearch(url);
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content fade-in-up">
                    <div className="hero-badge">
                        <span className="badge-icon">🎵</span>
                        <span>Instant music detection for Instagram Reels</span>
                    </div>

                    <h1 className="hero-title">
                        Find the song in any <span className="gradient-text">Instagram Reel</span>
                    </h1>

                    <p className="hero-subtitle">
                        Paste any public Instagram Reel link and get the song in seconds.
                        No app, no login, just the music.
                    </p>

                    <form className="hero-form" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input hero-input"
                                placeholder="https://www.instagram.com/reel/XXXXXXXX/"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={isLoading}
                            />
                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Find Song</span>
                                    <span className="btn-icon">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>Works with "original audio"</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>Free to use</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>No registration required</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
