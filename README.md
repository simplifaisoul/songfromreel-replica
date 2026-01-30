# SongFromReel Replica

A free, working replica of songfromreel.com that identifies songs from Instagram Reels using audio recognition technology.

## Features

- 🎵 **Instant Music Detection** - Identify songs from Instagram Reels in seconds
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 🔗 **Streaming Links** - Direct links to Spotify, Apple Music, Deezer, and YouTube
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- 🆓 **100% Free** - No registration or payment required

## How It Works

1. **Paste the Instagram Reel URL** - Copy any public Instagram Reel link
2. **We analyze the audio** - Our system extracts and analyzes the audio
3. **Get the song** - Receive song title, artist, and streaming links

## Setup

### Prerequisites

- Node.js 16+ installed
- AudD.io API key (free tier: 100 requests/day)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd songfromreel-replica
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_AUDD_API_KEY=your_audd_api_key_here
```

4. Get your free API key:
   - Visit [https://audd.io/](https://audd.io/)
   - Sign up for a free account
   - Copy your API key to the `.env` file

### Development

Run the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## API Configuration

### AudD.io (Recommended)
- **Free Tier**: 100 requests/day
- **Sign up**: https://audd.io/
- **Features**: Song recognition, Spotify/Apple Music/Deezer integration

### Alternative: ACRCloud
If you prefer ACRCloud, modify `src/services/musicRecognition.js` to use their API:
- **Free Tier**: 2000 requests/day
- **Sign up**: https://www.acrcloud.com/

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **AudD.io API** - Music recognition
- **Instagram API** - Reel data fetching
- **Vanilla CSS** - Styling with glassmorphism effects

## Limitations

- Works with public Instagram Reels only
- Song must exist in the recognition database
- API rate limits apply (100-2000 requests/day depending on service)
- Instagram may block direct API access (use RapidAPI as fallback)

## Deployment

Deploy to Vercel, Netlify, or any static hosting service:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the 'dist' folder to Netlify
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Disclaimer

This tool is not affiliated with or endorsed by Instagram, Meta Platforms, Inc., Spotify, Apple, or Deezer. All trademarks belong to their respective owners.
