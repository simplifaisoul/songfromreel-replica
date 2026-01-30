import './Results.css';

export default function Results({ result, onReset }) {
    if (!result) return null;

    const { title, artist, album, artwork, spotify, apple_music, deezer, youtube } = result;

    return (
        <section className="results">
            <div className="container">
                <div className="results-card glass-card scale-in">
                    <div className="results-header">
                        <div className="success-icon">✓</div>
                        <h2>Song Found!</h2>
                    </div>

                    <div className="results-content">
                        {artwork && (
                            <div className="artwork-wrapper">
                                <img src={artwork} alt={`${title} artwork`} className="artwork" />
                                <div className="artwork-glow" style={{ backgroundImage: `url(${artwork})` }}></div>
                            </div>
                        )}

                        <div className="song-info">
                            <h3 className="song-title">{title}</h3>
                            <p className="song-artist">{artist}</p>
                            {album && <p className="song-album">{album}</p>}
                        </div>

                        <div className="streaming-links">
                            <h4>Listen on:</h4>
                            <div className="links-grid">
                                {spotify && (
                                    <a href={spotify} target="_blank" rel="noopener noreferrer" className="streaming-btn spotify">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                        </svg>
                                        Spotify
                                    </a>
                                )}
                                {apple_music && (
                                    <a href={apple_music} target="_blank" rel="noopener noreferrer" className="streaming-btn apple">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c-.01.193-.01.386-.015.578v12.002c.005.195.005.39.015.586.02.628.06 1.254.18 1.87.24 1.24.915 2.214 2.05 2.882.686.403 1.44.588 2.22.656.27.024.54.03.81.04.5.01 1.003.014 1.504.014h12.016c.5 0 1.003-.004 1.504-.013.27-.01.54-.017.81-.04.78-.07 1.534-.254 2.22-.657 1.135-.668 1.81-1.642 2.05-2.882.12-.616.16-1.242.18-1.87.01-.196.01-.39.015-.586V6.7c-.004-.192-.004-.384-.014-.577zM8.078 13.543c.56 0 1.12 0 1.68.002.04 0 .078.005.117.01.378.044.677.38.677.76 0 .38-.3.716-.677.76-.04.005-.078.01-.117.01H6.31c-.04 0-.078-.005-.117-.01-.378-.044-.677-.38-.677-.76 0-.38.3-.716.677-.76.04-.005.078-.01.117-.01h1.768zm8.353 3.83c0 .94-.496 1.81-1.304 2.28-.808.47-1.8.47-2.608 0-.808-.47-1.304-1.34-1.304-2.28V9.59c0-.04.005-.078.01-.117.044-.378.38-.677.76-.677.38 0 .716.3.76.677.005.04.01.078.01.117v7.783c0 .47.248.905.652 1.14.404.235.9.235 1.304 0 .404-.235.652-.67.652-1.14V6.124c0-.04.005-.078.01-.117.044-.378.38-.677.76-.677.38 0 .716.3.76.677.005.04.01.078.01.117v11.25z" />
                                        </svg>
                                        Apple Music
                                    </a>
                                )}
                                {youtube && (
                                    <a href={youtube} target="_blank" rel="noopener noreferrer" className="streaming-btn youtube">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                        YouTube
                                    </a>
                                )}
                                {deezer && (
                                    <a href={deezer} target="_blank" rel="noopener noreferrer" className="streaming-btn deezer">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.81 4.16v3.03h5.19V4.16h-5.19zm0 4.52v3.03h5.19V8.68h-5.19zm0 4.53v3.02h5.19v-3.02h-5.19zM12.68 4.16v3.03h5.19V4.16h-5.19zm0 4.52v3.03h5.19V8.68h-5.19zm0 4.53v3.02h5.19v-3.02h-5.19zM6.55 13.21v3.02h5.19v-3.02H6.55zm0-4.53v3.03h5.19V8.68H6.55zM.42 17.73v3.03h5.19v-3.03H.42zm0-4.52v3.02h5.19v-3.02H.42zm0-4.53v3.03h5.19V8.68H.42z" />
                                        </svg>
                                        Deezer
                                    </a>
                                )}
                            </div>
                        </div>

                        <button onClick={onReset} className="btn btn-primary btn-reset">
                            <span>Try Another Reel</span>
                            <span className="btn-icon">↻</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
