import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatViewCount, timeSince } from '../../Service/FormatInfo';
import MiniSidebar from './MiniSidebar';
import { ModalContext } from '../../Service/ModelContext';

const SearchPage = () => {
    const { query } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showSidebar } = useContext(ModalContext);
    useEffect(() => {
        const loadVideos = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://youtube-clone-82b4.onrender.com/searchVideos?query=${encodeURIComponent(query)}`);
                setVideos(res.data.videos || []);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (query) loadVideos();
    }, [query]);

    return (
        <>
            <MiniSidebar />
            <div className={` md:pl-32 px-4 md:px-6 min-h-screen bg-white dark:bg-black text-black dark:text-white ${showSidebar ? `xl:pl-96` : ``}`}>
                <h2 className="text-xl sm:text-2xl mb-6 font-semibold">
                    Search results for: <span className="text-blue-600 dark:text-blue-400">{query}</span>
                </h2>

                {loading ? (
                    <p className="text-lg">Loading...</p>
                ) : videos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No results found.</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => navigate(`/watch/${video.videoId}`)}
                                className="flex flex-col sm:flex-row gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-3 rounded-lg transition"
                            >
                                {/* Thumbnail */}
                                <img
                                    src={`https://youtube-clone-82b4.onrender.com${video.thumbnail}`} alt={video.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/no-thumbnail.png';
                                    }}

                                    className="w-full sm:w-[320px] aspect-video object-cover rounded-lg"
                                />

                                {/* Video Info */}
                                <div className="flex flex-col justify-start gap-1 w-full">
                                    <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">{video.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatViewCount(video.views)} views • {timeSince(video.uploadDate)}
                                    </p>

                                    <div className="flex items-center mt-2 gap-3">
                                        <img
                                            src={video.channel.profileImage || 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                                            alt="Channel Avatar"
                                            className="w-9 h-9 rounded-full"
                                        />
                                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                                            {video.channel.channelName || 'Unknown Channel'}
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                        {video.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchPage;
