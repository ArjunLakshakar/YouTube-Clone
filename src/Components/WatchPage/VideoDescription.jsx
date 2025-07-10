import React, { useState } from 'react';
import { formatViewCount, timeSince } from '../../Service/FormatInfo';

const VideoDescription = ({ videoData }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const description = videoData.description || '';
  const shortDesc = description.substring(0, 200);

  return (
    <div className=" sm:text-lg text-sm  p-4 rounded-lg mb-6 whitespace-pre-line">
      <p className="text-base font-semibold mb-2">
        {formatViewCount(videoData.views)} views • {timeSince(videoData.uploadDate)}
      </p>

      <p>
        {showFullDesc ? description : shortDesc + (description.length > 250 ? '...' : '')}
      </p>

      {description.length > 250 && (
        <button
          className="mt-2 hover:underline"
          onClick={() => setShowFullDesc(!showFullDesc)}
        >
          {showFullDesc ? 'Show Less' : '...more'}
        </button>
      )}
    </div>
  );
};

export default VideoDescription;
