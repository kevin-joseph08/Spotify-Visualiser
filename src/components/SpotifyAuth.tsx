import { useEffect, useState } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

const CLIENT_ID = "7232162788584170a350c869aeeb4a71"; // You'll need to replace this with your Spotify Client ID
const REDIRECT_URI = 'https://spotify-visualiser-smoky.vercel.app/callback';
const SCOPES = ['user-read-playback-state', 'user-read-currently-playing'];

export const SpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Handle the callback
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
        }),
      });

      const data = await response.json();
      const api = SpotifyApi.withAccessToken(CLIENT_ID, data.access_token);
      setSpotifyApi(api);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during authentication:', error);
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
    <Box p={8} textAlign="center">
      <Heading mb={4}>Spotify Visualizer</Heading>
      {!isAuthenticated ? (
        <Button colorScheme="green" onClick={handleLogin}>
          Connect with Spotify
        </Button>
      ) : (
        <Text>Successfully authenticated with Spotify!</Text>
      )}
    </Box>
  );
}; 