import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatViewCount, timeSince } from '../../Service/FormatInfo';
import { BiInfoCircle, BiShare, BiShareAlt, BiSolidInfoCircle, BiWorld } from 'react-icons/bi';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Channel = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [channelData, setChannelData] = useState({});
    const [showChannelInfoModal, setShowChannelInfoModal] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    const currentUser = useSelector((state) => state.user?.user);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("Token missing!");

        // fetch channel data
        const fetchMyChannel = async () => {
            try {
                const res = await axios.get("http://localhost:3000/getChannel", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChannelData(res.data?.channel);
            } catch (error) {
                console.error("Error fetching your channel data:", error.response?.data || error.message);
            }
        };

        // fetch channel vidoes
        const fetchMyVideos = async () => {
            try {
                const res = await axios.get("http://localhost:3000/getChannelVideos", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVideos(res.data.videos || []);
            } catch (err) {
                console.error("Error fetching your videos:", err);
            }
        };

        // fetching others channel data
        const fetchChannelById = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/getChannelById/${channelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const channel = res.data?.channel;
                const videoList = res.data?.videos || [];

                setChannelData(channel);
                setVideos(videoList);
                setSubscriberCount(channel.subscribers?.length || 0);

                // Set isSubscribed
                if (currentUser?.userId && Array.isArray(channel.subscribers)) {
                    setIsSubscribed(channel.subscribers.includes(currentUser.userId));
                }

            } catch (err) {
                console.error("Error fetching channel by ID:", err);
            }
        };

        if (channelId) {
            fetchChannelById();
        } else {
            fetchMyChannel();
            fetchMyVideos();
        }
    }, [channelId]);


    const handleSubscribeToggle = async () => {
        try {
            const res = await axios.put(`http://localhost:3000/subscribe/${channelData.channelId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setIsSubscribed(res.data.isSubscribed);
            setSubscriberCount(res.data.subscribersCount);
        } catch (error) {
            console.error("Error subscribing:", error.response?.data || error.message);
        }
    };


    return (
        <>
            <div className="min-h-screen py-4 md:max-w-[85%] max-w-[90%]  mx-auto flex flex-col item-center  md:pl-12 bg-white dark:bg-black text-black dark:text-white ">
                {/* Banner */}
                {channelData.channelBanner && (
                    <div className="w-full mb-6">
                        <img src={channelData.channelBanner} alt="Banner" className="w-full h-48 sm:h-60 md:h-72 rounded-2xl object-cover" />
                    </div>
                )}

                {/* Profile Section */}
                <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-6">
                    <img
                        src={channelData.profileImage || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                        alt="Avatar"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full object-cover"
                    />

                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-4xl font-bold">{channelData.channelName}</h1>
                        <p className="text-lg sm:text-xl font-semibold">{channelData.handle}</p>
                        <p
                            className="cursor-pointer text-sm sm:text-base text-gray-600 dark:text-gray-400"
                            onClick={() => setShowChannelInfoModal(true)}
                        >
                            {channelData.description?.length > 35
                                ? channelData.description.slice(0, 35) + '...'
                                : channelData.description || "No description"}
                        </p>

                        {/* checking which channel data to show */}
                        {/* {channelId && currentUser?.userId !== channelData?.userId ? (
                            <div className='flex items-center '>
                                <button className='py-3 px-4 mt-4 font-semibold bg-zinc-900 text-white dark:text-black dark:bg-white text-lg sm:text-xl rounded-full '>
                                    Subscribe
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                                <button
                                    className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 text-sm sm:text-lg rounded-full"
                                    onClick={() => navigate('/channelSettings')}
                                >
                                    Customize channel
                                </button>
                                <button
                                    className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 text-sm sm:text-lg rounded-full"
                                    onClick={() => navigate('/channelContent')}
                                >
                                    Manage videos
                                </button>
                            </div>
                        )} */}
                        {channelId && currentUser?.userId !== channelData?.owner ? (
                            <div className='flex items-center'>
                                <button
                                    onClick={handleSubscribeToggle}
                                    className={`py-3 px-4 mt-4 font-semibold text-lg sm:text-xl rounded-full 
                ${isSubscribed ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white dark:text-black dark:bg-white'}`}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                                <button
                                    className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 text-sm sm:text-lg rounded-full"
                                    onClick={() => navigate('/channelSettings')}
                                >
                                    Customize channel
                                </button>
                                <button
                                    className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 text-sm sm:text-lg rounded-full"
                                    onClick={() => navigate('/channelContent')}
                                >
                                    Manage videos
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-6 border-b dark:border-zinc-700 border-gray-300 text-lg sm:text-xl font-semibold mb-6">
                    <button className="pb-2 border-b-2 border-blue-500 text-blue-500">Videos</button>
                    <button className="pb-2 text-gray-400 dark:text-gray-500">Posts</button>
                </div>

                {/* Videos Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <div key={index} className="rounded-xl shadow bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
                            onClick={() => navigate(`/watch/${video.videoId}`)}>
                            <img
                                src={`http://localhost:3000${video.thumbnail}`} alt={video.title}
                                className="w-full h-40 sm:h-44 md:h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-md sm:text-lg font-semibold mb-1 line-clamp-2">
                                    {video.title.length > 60 ? video.title.slice(0, 57) + "..." : video.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatViewCount(video.views)} views • {timeSince(video.uploadDate)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Show info like - description, channel created date, handle */}
            {showChannelInfoModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div
                        id="channel-info-modal"
                        className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-[95%] max-w-xl md:max-w-2xl relative shadow-lg overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-3 text-xl text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                            onClick={() => setShowChannelInfoModal(false)}
                        >
                            &#x2715;
                        </button>

                        {/* Channel Name */}
                        <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-white">
                            {channelData.channelName}
                        </h2>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-base text-zinc-700 dark:text-zinc-300 break-words whitespace-pre-wrap">
                                <strong className="text-black dark:text-white xs:text-xl text-lg">Description:</strong><br />
                                {channelData.description || "No description"}
                            </p>
                        </div>

                        {/* More Info */}
                        <div className=" text-zinc-600 dark:text-white space-y-4 sm:text-xl text-base">
                            <p><strong className="text-black dark:text-white ">More info:</strong></p>
                            <p className="flex gap-4 items-center ">
                                <BiWorld className='sm:text-2xl text-lg ' /> <span className='xs:text-sm text-xs sm:text-xl'> https://youtube.com/{channelData.handle || "handle"}</span>
                            </p >
                            <p className="flex gap-4 items-center">
                                <BiInfoCircle className='sm:text-2xl text-lg' />
                                <span className='xs:text-sm text-xs sm:text-xl'>
                                    Joined: {channelData.createdDate ? new Date(channelData.createdDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </span>
                            </p>

                        </div>

                        {/* Share Button */}
                        <button className="mt-6 px-3 py-2 flex items-center dark:text-white  bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-full sm:text-xl text-sm font-semibold">
                            <BiShare className='sm:text-2xl text-xl mx-2' /> Share channel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Channel;
