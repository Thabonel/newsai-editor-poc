import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

type Status = 'processing' | 'ready';

export default function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<Status>('processing');

  useEffect(() => {
    const timer = setTimeout(() => setStatus('ready'), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'ready' && videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        preload: 'auto',
        sources: [{ src: VIDEO_URL, type: 'video/mp4' }],
        responsive: true,
        fluid: true,
      });
      return () => {
        player.dispose();
      };
    }
  }, [status]);

  return (
    <div className="relative w-full h-full bg-black border-2 border-gray-700 flex items-center justify-center">
      {status === 'processing' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center p-4">
            Preview will appear here after editing
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-white" />
          </div>
        </>
      )}
      <div className={`w-full h-full ${status !== 'ready' ? 'invisible' : ''}`}>
        <div data-vjs-player className="h-full w-full">
          <video ref={videoRef} className="video-js vjs-big-play-centered h-full w-full" />
        </div>
      </div>
    </div>
  );
}
