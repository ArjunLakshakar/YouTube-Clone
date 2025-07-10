import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faBell, } from '@fortawesome/free-solid-svg-icons';
import { faUpDown } from '@fortawesome/free-solid-svg-icons/faUpDown';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons/faThumbsDown';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineShareAlt } from 'react-icons/ai';
import { BsArrowDown, BsArrowUpRightSquare, BsCloudDownload, BsDownload, BsFillReplyAllFill, BsReply, BsReplyAll, BsReplyFill } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';
import { BiBookmark, BiDotsHorizontal, BiDotsVertical, BiSolidDownload } from 'react-icons/bi';
import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs'; // ✅ Add at the top
import { useSelector } from 'react-redux';
import { formatViewCount, timeSince } from '../Service/FormatInfo';
import VideoDescription from '../Components/WatchPage/VideoDescription';
import { showError, showInfo, showSuccess } from '../Service/NotificationService';
import { useLocation } from 'react-router-dom';

const WatchPage = () => {
    const location = useLocation();
    const { videoId } = useParams();
    const [videoData, setVideoData] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [channelData, setChannelData] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [activeMenu, setActiveMenu] = useState(null); 
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);


    const user = useSelector((state) => state.user?.user);
    const userId = user?.userId;

    // scrolls to top
    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                setIsLoading(true); 
                const res = await axios.get(`http://localhost:3000/getVideo/${videoId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setVideoData(res.data.video);
                setChannelData(res.data.channel);
                setLikeCount(res.data.video.likes.length);
                setDislikeCount(res.data.video.dislikes.length);
                setHasLiked(res.data.hasLiked);
                setHasDisliked(res.data.hasDisliked);
                setIsSubscribed(res.data.isSubscribed || false);
                setSubscriberCount(res.data.channel.subscribers?.length || 0);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching video:', error);
                setIsLoading(false);
            }
        };

        const fetchRelatedVideos = async () => {
            try {
                const res = await axios.get('http://localhost:3000/getAllVideos');
                setRelatedVideos(res.data.videos || []);
            } catch (error) {
                console.error('Error fetching related videos:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/getComments/${videoId}`);
                setComments(res.data.comments || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
        fetchVideoDetails();
        fetchRelatedVideos();
    }, [videoId, location.key]);


    async function handleCommentSubmit(commentText) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showInfo("Login Required", "Login to comment on this video.");
                return;
            }
            const res = await axios.post(`http://localhost:3000/addComment/${videoId}`, {
                comment: commentText
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setComments(prev => [...prev, res.data.enrichedComment]);
            console.log('Comment added:', res.data.comment);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showInfo("Login Required", "Login to delete comment.");
                return;
            }
            const err = await axios.delete(`http://localhost:3000/deleteComment/${videoId}/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setComments(prev => prev.filter(c => c.commentId !== commentId));
            setActiveMenu(null);
        } catch (error) {
            showError("Delete Failed", error.response.data?.message || "Failed to delete comment. Please try again later.");
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showInfo("Login Required", "Login to comment on this video.");
                return;
            }
            await axios.put(
                `http://localhost:3000/editComment/${videoId}/${commentId}`,
                { text: editedText },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setComments(prev =>
                prev.map((c) =>
                    c.commentId === commentId ? { ...c, text: editedText } : c
                )
            );
            setEditingIndex(null);
            setEditedText('');
            setActiveMenu(null);
        } catch (error) {
            showError("Edit Failed", error.response.data?.message || "Failed to edit comment. Please try again later.");
        }
    };

    useEffect(() => {
        if (videoData && userId) {
            setLikeCount(videoData.likes.length);
            setDislikeCount(videoData.dislikes.length);
            setHasLiked(videoData.likes.includes(userId));
            setHasDisliked(videoData.dislikes.includes(userId));
        }
    }, [videoData]);

    const handleSubscribe = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showInfo("Login Required", "Login to subscribe to this channel.");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:3000/subscribe/${channelData.channelId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsSubscribed(res.data.isSubscribed);
            setSubscriberCount(res.data.subscriberCount);
            showSuccess(res.data.message);
        } catch (error) {
            showError("Failed", error.response?.data?.message || "Could not subscribe.");
        }
    };


    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showInfo("Login Required", "Login to like this video.");
                return;
            }
            const res = await axios.put(`http://localhost:3000/like/${videoId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLikeCount(res.data.likes);
            setDislikeCount(res.data.dislikes);
            setHasLiked(res.data.hasLiked);
            setHasDisliked(res.data.hasDisliked);
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleDislike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showInfo("Login Required", "Login to dislike this video.");
                return;
            }
            const res = await axios.put(`http://localhost:3000/dislike/${videoId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLikeCount(res.data.likes);
            setDislikeCount(res.data.dislikes);
            setHasLiked(res.data.hasLiked);
            setHasDisliked(res.data.hasDisliked);
        } catch (error) {
            console.error('Error disliking video:', error);
        }
    };

    if (isLoading || !videoData) return <div className='text-white p-6'>Loading...</div>;


    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 bg-white text-black dark:bg-black dark:text-white min-h-screen ">
            {/* Main Video Content */}
            <div className="lg:w-2/3 w-full">
                <video key={videoId} controls className="w-full rounded-xl aspect-video mb-4">
                    <source src={`http://localhost:3000${videoData.videoFile}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <h2 className="sm:text-2xl text-xl font-semibold mb-1">{videoData.title}</h2>

                <div className="flex sm:flex-row flex-col justify-between md:gap-1 gap-4 dark:text-gray-400 text-sm mb-3 pt-2">
                    <div className="flex items-center gap-4">
                        <img
                            src={channelData?.profileImage || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                            alt="avatar"
                            className='w-12 h-12 rounded-full cursor-pointer object-cover'
                            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                        />
                        <div className='flex flex-col'>
                            <p
                                className='text-xl cursor-pointer'
                                onClick={() => {
                                    const newPath = `/channel/${channelData.channelId}`;
                                    if (window.location.pathname === newPath) {
                                        navigate('/'); // Temporary redirect
                                        setTimeout(() => navigate(newPath), 0); // Force reload
                                    } else {
                                        navigate(newPath);
                                    }
                                }}
                            >
                                {channelData.channelName}
                            </p>
                            <p className='text-md'>{subscriberCount} subscribers</p>

                        </div>

                        {/* check subscribed or not */}
                        {userId !== channelData?.userId && (
                            <button
                                onClick={handleSubscribe}
                                className={`flex justify-center items-center gap-2 rounded-3xl xl:py-3 sm:py-2 py-1 ml-3 px-4 text-xl font-medium 
                             ${isSubscribed ? 'bg-gray-300 dark:bg-zinc-700 text-black dark:text-white' : 'bg-black text-white dark:bg-white dark:text-black '}`}
                            >
                                <FontAwesomeIcon icon={faBell} className="xl:flex hidden" />
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}
                    </div>


                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <div className='flex items-center justify-center xl:text-2xl sm:text-xl text-lg bg-gray-200 dark:bg-zinc-800 rounded-full'>
                            <p onClick={handleLike} className={`flex items-center justify-center xl:gap-4 gap-2 sm:py-2 py-1  xl:px-6 px-3 rounded-l-full cursor-pointer ${hasLiked ? 'dark:bg-zinc-700' : 'dark:hover:bg-zinc-700'}`}>
                                {hasLiked ? <AiFillLike className='sm:text-2xl text-xl' /> : <AiOutlineLike className='sm:text-2xl text-xl' />} {likeCount}
                            </p>
                            |
                            <p onClick={handleDislike} className={`flex items-center justify-center xl:gap-4 gap-2 sm:py-2 py-1  xl:px-6 px-3 rounded-r-full cursor-pointer ${hasDisliked ? 'dark:bg-zinc-700' : 'dark:hover:bg-zinc-700'}`}>
                                {hasDisliked ? <AiFillDislike className='sm:text-2xl text-xl' /> : <AiOutlineDislike className='sm:text-2xl text-xl' />} {dislikeCount}
                            </p>
                        </div>

                        <button className="bg-gray-200 dark:bg-zinc-800 rounded-full flex sm:py-2 py-1 px-3 sm:text-xl text-lg gap-3 items-center justify-center">
                            <BsReply className="cursor-pointer sm:text-2xl text-xl " /> Share</button>
                        <button className="bg-gray-200 dark:bg-zinc-800 rounded-full xl:flex sm:hidden xs:flex hidden sm:py-2 py-1 px-3 sm:text-xl text-lg gap-3 items-center justify-center">
                            <BiBookmark className='sm:text-2xl text-xl' /> Save
                        </button>
                        <button className="bg-gray-200 dark:bg-zinc-800 rounded-full xl:hidden flex sm:py-2 py-1 px-1 text-xl gap-3 items-center justify-center">
                            <BiDotsVertical />
                        </button>
                    </div>
                </div>

                {/* video Description */}
                <div className="bg-gray-200 dark:bg-zinc-900 text-lg dark:text-gray-100 rounded-lg whitespace-pre-line">
                    <VideoDescription videoData={videoData} />
                </div>

                {/* Related Vidoe */}
                <div>
                    <h1 className='md:text-3xl xs:text-2xl text-xl font-bold mb-5'>Popular Videos</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
                        {relatedVideos.slice(0, 8).map((video) => {
                            const id = video.videoId;
                            if (!id) return null;

                            return (
                                <div
                                    key={id}
                                    className="flex flex-col gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-lg"
                                    onClick={() => navigate(`/watch/${id}`)}
                                >
                                    <img
                                        src={`http://localhost:3000${video.thumbnail}`} alt={video.title}
                                        className="w-full h-40 sm:h-36 md:h-32 rounded-lg object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-base font-medium leading-tight line-clamp-2">
                                            {video.title}
                                        </p>
                                        {/* Optional: channel title */}
                                        <p className="text-base text-gray-400 mt-1">{video.channel.channelName}</p>
                                        <p className="text-gray-400 text-sm ">
                                            {formatViewCount(video.views)} views • {timeSince(video.uploadDate)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Comments section */}
                <div>
                    <h3 className="text-lg font-semibold my-3">Comments</h3>
                    <div className="flex flex-col gap-3 mb-4">
                        <div className='flex gap-2'>
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                                alt="User"
                                className="w-10 h-10 rounded-full "
                            />
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-full px-4 py-2 dark:bg-black rounded-lg focus:border-b-slate-500  focus:border-b focus:outline-none"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && commentText.trim()) {
                                        handleCommentSubmit(commentText);
                                        setCommentText('');
                                    }
                                }}
                            />
                        </div>

                        <div className='flex justify-end gap-3'>
                            <button className="  rounded-full flex py-2 px-3 text-xl gap-3 items-center justify-center">Cancel</button>
                            <button onClick={() => {
                                handleCommentSubmit(commentText.trim());
                                setCommentText('');
                            }} className="bg-gray-200 dark:bg-zinc-800 rounded-full flex py-2 px-3 text-xl gap-3 items-center justify-center">Comment</button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-8 mb-4'>

                        {comments.map((comment, index) => (
                            <div key={index} className='flex gap-6 relative group'>
                                {/* Avatar */}
                                <div>
                                    <img
                                        src={comment.avatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                                        alt="avatar"
                                        className='w-12 h-12 rounded-full cursor-pointer'
                                    />
                                </div>

                                {/* Comment Content */}
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3 text-gray-500 text-sm'>
                                            <p className='text-lg font-semibold'>{comment.username}</p>
                                            <span>{timeSince(comment.date)}</span>
                                        </div>

                                        {/* 3-dot icon */}
                                        <div className='relative'>
                                            <BsThreeDotsVertical
                                                className='cursor-pointer text-xl text-gray-400'
                                                onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                            />
                                            {activeMenu === index && (
                                                <div className='absolute right-0 mt-2 w-28 bg-zinc-800 text-white rounded-2xl shadow-lg z-10'>
                                                    <button
                                                        className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                                        onClick={() => {
                                                            setEditingIndex(index);
                                                            setEditedText(comment.text);
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className='block w-full text-left px-4 py-2 hover:bg-zinc-700'
                                                        onClick={() => handleDeleteComment(comment.commentId)}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {editingIndex === index ? (
                                        <div className='flex gap-2 mt-1'>
                                            <input
                                                className='bg-transparent border-b border-gray-400 focus:outline-none w-full'
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleEditComment(comment.commentId)}
                                                className='sm:text-base text-sm text-blue-400 hover:underline'
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingIndex(null);
                                                    setEditedText('');
                                                }}
                                                className='sm:text-base text-sm text-gray-400 hover:underline'
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-md mt-1 break-all whitespace-pre-wrap text-gray-800 dark:text-gray-200 w-full">
                                            {comment.text}
                                        </p>
                                    )}

                                    <span className='cursor-pointer text-gray-500 text-sm'>Reply</span>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>

            {/* Related (Popular) Videos */}
            <div className="hidden lg:flex flex-col flex-[1] w-1/3 space-y-4 pl-4">
                {/* <div className="fixed lg:flex flex-col hidden right-0 w-1/3 flex-[1] space-y-4 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600"> */}
                <h1 className='text-3xl font-bold mb-5'>Popular Videos</h1>
                {relatedVideos.slice(0, 8).map((video) => {
                    const id = video.videoId;
                    if (!id) return null;

                    return (
                        <div
                            key={id}
                            className="flex gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-lg"
                            onClick={() => navigate(`/watch/${id}`)}
                        >
                            <img
                                src={`http://localhost:3000${video.thumbnail}`} alt={video.title}
                                className="w-44 h-32 rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                                <p className="text-xl font-medium leading-tight line-clamp-2">
                                    {video.title}
                                </p>
                                <p className="text-lg text-gray-400 mt-1">{video.channel.channelName}</p>
                                <p className="text-gray-400 text-base ">
                                    {formatViewCount(video.views)} views • {timeSince(video.uploadDate)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WatchPage;
