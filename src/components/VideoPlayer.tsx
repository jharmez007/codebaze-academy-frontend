"use client";

import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoUrl: string;
  videoType?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, videoType }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    if (!video) return;

    // if caller did not supply a type, attempt to guess from url
    const type = videoType || (videoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4');

    if (type === 'application/x-mpegURL') {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,       // Only buffer 30s ahead (saves data)
          startLevel: -1,            // Auto-select quality based on bandwidth
          capLevelToPlayerSize: true // Don't load 1080p on a small screen
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        // clean up when component unmounts or url changes
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = videoUrl;
      }
    } else {
      // fallback to normal video tag (mp4, webm, etc.)
      video.src = videoUrl;
    }
  }, [videoUrl, videoType]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: '100%' }}
      preload="metadata"
      controlsList="nodownload"
    />
  );
};

export default VideoPlayer;
