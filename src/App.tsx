import { useState, useEffect } from 'react';
import { SpotifyAuth } from './components/SpotifyAuth';
import { Visualizer } from './components/Visualizer';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);
  const [currentTrack, setCurrentTrack] = useState<{
    name: string;
    artist: string;
    previewUrl: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (spotifyApi) {
      const checkPlayback = async () => {
        try {
          const playback = await spotifyApi.player.getPlaybackState();
          if (playback.item && 'artists' in playback.item) {
            const item = playback.item as {
              name: string;
              artists: { name: string }[];
              preview_url: string | null;
            };
            
            setCurrentTrack({
              name: item.name,
              artist: item.artists[0].name,
              previewUrl: item.preview_url || '',
            });
            setIsPlaying(playback.is_playing);
          }
        } catch (error) {
          console.error('Error fetching playback state:', error);
        }
      };

      const interval = setInterval(checkPlayback, 1000);
      return () => clearInterval(interval);
    }
  }, [spotifyApi]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <SpotifyAuth
            onAuthenticated={(api) => {
              setSpotifyApi(api);
              setIsAuthenticated(true);
            }}
          />
        ) : (
          <>
            {currentTrack && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{currentTrack.name}</h2>
                <p className="text-gray-400">{currentTrack.artist}</p>
              </div>
            )}
            {currentTrack && (
              <Visualizer
                isPlaying={isPlaying}
                audioUrl={currentTrack.previewUrl}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
