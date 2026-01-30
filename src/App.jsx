import { useState } from 'react';
import Hero from './components/Hero';
import Results from './components/Results';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { fetchInstagramReel } from './services/instagram';
import { recognizeSong } from './services/musicRecognition';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (url) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Fetch Instagram Reel
      const reelData = await fetchInstagramReel(url);

      // Step 2: Recognize song from audio
      const songData = await recognizeSong(reelData.audioUrl);

      setResult(songData);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="app-background"></div>

      {!result ? (
        <>
          <Hero onSearch={handleSearch} isLoading={isLoading} />
          {error && (
            <div className="error-banner">
              <div className="container">
                <div className="error-content">
                  <span className="error-icon">⚠️</span>
                  <div>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Results result={result} onReset={handleReset} />
      )}

      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
