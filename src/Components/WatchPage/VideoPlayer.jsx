import React from 'react';

const VideoPlayer = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-2xl z-50"
        >
          ✕
        </button>
        <video controls autoPlay className="w-full h-full rounded-xl">
          <source src={`http://localhost:3000${videoUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
