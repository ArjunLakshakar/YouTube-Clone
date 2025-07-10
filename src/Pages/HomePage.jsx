import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ModalContext } from '../Service/ModelContext';
import MiniSidebar from '../Components/Header/MiniSidebar';
import CategoryBar from '../Components/Header/CategoryBar';
import { formatViewCount, timeSince } from '../Service/FormatInfo';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { showSidebar } = useContext(ModalContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/getAllVideos');
      const initialVideos = res.data.videos || [];
      setVideos(initialVideos);
    } catch (error) {
      console.error("Error loading initial videos:", error);
    }
  };

  useEffect(() => {
    fetchVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchVideosByCategory = async (category) => {
    try {
      const url =
        category === "All"
          ? "http://localhost:3000/getAllVideos"
          : `http://localhost:3000/getAllVideos?category=${category.toLowerCase()}`;
      const res = await axios.get(url);
      setVideos(res.data.videos || []);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };


  return (
    <div className="flex dark:bg-black bg-white min-h-screen">
      <MiniSidebar />

      <div className="flex-1 md:ml-24">
        {/* Category bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onCategoryClick={setSelectedCategory}
          toggleSidebar={false}
        />

        {/* Video grid */}
        <div className={`px-6 pt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ${showSidebar ? `xl:pl-60` : ``}`}>
          {videos.length > 0 ? (
            videos.map(video => (
              <div
                key={video.videoId}
                className="dark:bg-zinc-900 dark:text-white text-black rounded-xl p-3 cursor-pointer dark:hover:bg-zinc-800 flex flex-col"
                onClick={() => navigate(`/watch/${video.videoId}`)}
              >
                <img
                  src={`http://localhost:3000${video.thumbnail}`} alt={video.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/no-thumbnail.png';
                  }}
                  className="rounded-md w-full aspect-video object-cover"
                />
                <div className='flex gap-5 mt-3 items-center xl:text-lg text-base'>
                  <img src={video.channel.profileImage || `https://cdn-icons-png.flaticon.com/128/3135/3135715.png`} alt={video.channel.channelName} className='w-12 h-12 rounded-full object-cover' />
                  <div>
                    <h3 className="mt-2 font-semibold line-clamp-2 xl:text-2xl text-xl">
                      {video.title.length > 55 ? `${video.title.slice(0, 55)}...` : video.title}
                    </h3>
                    <p className="text-gray-400 mt-1">{video.channel.channelName || "Unknown"}</p>
                    <p className="text-gray-400">
                      {formatViewCount(video.views)} views • {timeSince(video.uploadDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-20 text-xl font-medium">
              No videos found for the "{selectedCategory}" category.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
