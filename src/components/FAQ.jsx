import { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'What is SongFromReel?',
            answer: 'SongFromReel is an online Instagram Reel song finder. You paste a public Reel link, we analyze the audio, and we show you the song title and artist + links to listen on streaming platforms when available.'
        },
        {
            question: 'How do I find the song from an Instagram Reel?',
            answer: 'Copy the URL of the Reel in the Instagram app or browser, paste it into SongFromReel, and click "Find song". Our system listens to the Reel audio and tries to identify the song from the Reel automatically.'
        },
        {
            question: 'Does this work with any Reel?',
            answer: 'SongFromReel works with most public Instagram Reels, including many clips that use "original audio". As long as we can access the audio and the music exists in our recognition database, we can often identify the song even if Instagram labels it as original audio. It may not work for private, region-restricted or deleted Reels.'
        },
        {
            question: 'Do I need an app?',
            answer: 'No. SongFromReel is a web-based song detection tool. You don\'t need to install an app.'
        },
        {
            question: 'Is there a limit on how many Reels I can check?',
            answer: 'Normal usage is totally fine. Extremely heavy or automated usage may be limited to keep the service fast and stable for everyone.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq">
            <div className="container">
                <h2 className="section-title gradient-text">FAQ</h2>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item glass-card ${openIndex === index ? 'open' : ''}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            </button>

                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
