# Spotify Visualizer

A React application that connects to your Spotify account and creates a real-time audio visualization of your currently playing track.

## Features

- Spotify authentication
- Real-time playback state monitoring
- Audio visualization using Tone.js
- Responsive design with Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Spotify Developer account

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Spotify Developer account and register your application:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Note down your Client ID and Client Secret
   - Add the following Redirect URI to your application settings:
     - For development: `http://127.0.0.1:5173/callback`
     - For production: `https://your-domain.com/callback` (with valid SSL certificate)

4. Create a `.env` file in the root directory:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Security Requirements

When setting up your Spotify application, please note these important security requirements:

- For local development:
  - Use `http://127.0.0.1:PORT` or `http://[::1]:PORT` as your redirect URI
  - Do not use `localhost` as it is not allowed
  - HTTP is permitted for loopback addresses

- For production:
  - Always use HTTPS for your redirect URI
  - Ensure your server has a valid SSL certificate
  - Use your production domain in the redirect URI

## Usage

1. Open your browser and navigate to `http://127.0.0.1:5173`
2. Click "Connect with Spotify" to authenticate
3. Start playing a track on your Spotify account
4. The visualizer will automatically display the audio visualization

## Technologies Used

- React
- TypeScript
- Vite
- Spotify Web API
- Tone.js
- Chakra UI

## License

MIT
