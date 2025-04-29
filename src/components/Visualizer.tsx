import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface VisualizerProps {
  isPlaying: boolean;
  audioUrl: string;
}

export const Visualizer = ({ isPlaying, audioUrl }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analyser, setAnalyser] = useState<Tone.Analyser | null>(null);
  const [player, setPlayer] = useState<Tone.Player | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudio = async () => {
    try {
      await Tone.start();
      const newPlayer = new Tone.Player(audioUrl).toDestination();
      const newAnalyser = new Tone.Analyser('waveform', 1024);
      newPlayer.connect(newAnalyser);
      
      setPlayer(newPlayer);
      setAnalyser(newAnalyser);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (!analyser) return;
      
      const waveform = analyser.getValue();
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 255, 0)';
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / waveform.length;
      let x = 0;
      
      for (let i = 0; i < waveform.length; i++) {
        const v = waveform[i] as number;
        const y = v * canvas.height / 2 + canvas.height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    animate();

    return () => {
      if (player) {
        player.dispose();
      }
      if (analyser) {
        analyser.dispose();
      }
    };
  }, [analyser, player]);

  useEffect(() => {
    if (player && isInitialized) {
      if (isPlaying) {
        player.start();
      } else {
        player.stop();
      }
    }
  }, [isPlaying, player, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center p-4">
        <button
          onClick={initializeAudio}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Start Visualization
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto"
      />
      <p className="text-center mt-4">
        {isPlaying ? 'Now Playing' : 'Paused'}
      </p>
    </div>
  );
}; 