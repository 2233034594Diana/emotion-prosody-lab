import React, { useEffect, useRef } from 'react';
import { audioPlayer } from '../utils/audio';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        const data = audioPlayer.getVisualizerData();
        if (data) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#4f46e5';
          ctx.beginPath();
          
          const sliceWidth = width * 1.0 / data.length;
          let x = 0;

          for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }
      } else {
        // Draw flat line
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={128} className="w-full h-full" />
    </div>
  );
}
