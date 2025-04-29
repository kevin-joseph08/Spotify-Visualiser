import { useEffect, useState } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:5173/callback';
const SCOPES = ['user-read-playback-state', 'user-read-currently-playing'];

interface SpotifyAuthProps {
  onAuthenticated: (api: SpotifyApi) => void;
}

export const SpotifyAuth = ({ onAuthenticated }: SpotifyAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET),
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Spotify');
      }

      const data = await response.json();
      const api = SpotifyApi.withAccessToken(CLIENT_ID, data.access_token);
      onAuthenticated(api);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Failed to authenticate with Spotify. Please try again.');
    }
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
    })}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Spotify Visualizer</h1>
      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}
      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Connect with Spotify
        </button>
      ) : (
        <p>Successfully authenticated with Spotify!</p>
      )}
    </div>
  );
}; 