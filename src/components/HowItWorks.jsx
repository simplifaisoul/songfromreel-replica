import './HowItWorks.css';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: '🔗',
            title: 'Paste the Instagram Reel URL',
            description: 'Copy the link of any public Instagram Reel and paste it into SongFromReel. Example: https://www.instagram.com/reel/XXXXXXXX/'
        },
        {
            number: '02',
            icon: '🎧',
            title: 'We analyze the Reel audio',
            description: "Our backend analyzes the audio from the Reel and runs it through a music recognition engine. We don't rely only on Instagram's metadata. We actually listen to the track."
        },
        {
            number: '03',
            icon: '🎵',
            title: 'We find the song title and artist',
            description: "If we detect a match, you'll see the song name, artist, and links to open it on Spotify, Apple Music, or Deezer whenever the music is available."
        }
    ];

    return (
        <section id="how" className="how-it-works">
            <div className="container">
                <h2 className="section-title gradient-text">How it works</h2>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="step-card glass-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
