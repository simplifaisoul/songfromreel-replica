import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="#how">How it works</a>
                        <a href="#faq">FAQ</a>
                        <a href="#about">About</a>
                    </div>

                    <p className="footer-text">
                        © 2025 SongFromReel • Instagram Reel Song Finder – Find Music from Reels by URL
                    </p>

                    <p className="footer-disclaimer">
                        SongFromReel is an independent tool and is not affiliated with or endorsed by Instagram, Meta Platforms, Inc., Spotify, Apple or Deezer.
                    </p>
                </div>
            </div>
        </footer>
    );
}
