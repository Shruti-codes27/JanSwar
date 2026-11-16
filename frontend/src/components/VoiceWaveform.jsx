import React, { useEffect, useState } from 'react';

export default function VoiceWaveform({ isRecording, isPlaying, statusText }) {
  const [bars, setBars] = useState([15, 25, 45, 65, 85, 95, 75, 55, 35, 20, 40, 60, 80, 50, 30, 20]);

  useEffect(() => {
    let interval;
    if (isRecording || isPlaying) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 15));
      }, 90);
    } else {
      setBars([12, 16, 20, 24, 28, 30, 26, 22, 18, 14, 16, 22, 28, 20, 15, 12]);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center py-3">
      <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-sm px-4">
        {bars.map((height, idx) => (
          <span
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-100 ${
              isRecording
                ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                : isPlaying
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                : 'bg-slate-300'
            }`}
            style={{
              height: `${(isRecording || isPlaying) ? height : 12}%`,
              minHeight: '4px'
            }}
          />
        ))}
      </div>
      {statusText && (
        <p className="text-xs font-semibold tracking-wide mt-2 text-slate-500 flex items-center gap-1.5">
          {(isRecording || isPlaying) && (
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
          )}
          <span>{statusText}</span>
        </p>
      )}
    </div>
  );
}
