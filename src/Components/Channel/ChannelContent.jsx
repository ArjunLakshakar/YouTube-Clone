import React, { useEffect, useState } from "react";
import { BiWorld } from "react-icons/bi";
import Sidebar from "./Sidebar";
import axios from "axios";

const ChannelContent = () => {
  const [videos, setVideos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token missing!");
      try {
        const res = await axios.get("http://localhost:3000/getChannelVideos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, []);

  const handleEditClick = (video) => {
    setCurrentVideo({ ...video });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/editVideo/${currentVideo.videoId}`,
        {
          title: currentVideo.title,
          description: currentVideo.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setVideos((prev) =>
        prev.map((v) =>
          v.videoId === currentVideo.videoId ? res.data.video : v
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating video:", err);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`http://localhost:3000/deleteVideo/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVideos((prev) => prev.filter((v) => v.videoId !== videoId));
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white ">
      {/* sidebar */}
      <Sidebar />

      {/* Channel Content */}
      <main className="flex-1 w-full px-4 md:px-6 pb-10 overflow-x-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
          Channel Content
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-14 overflow-x-auto border-b border-zinc-300 dark:border-zinc-700 mb-4 text-base">
          {["Videos", "Shorts", "Live", "Posts", "Playlists"].map((tab) => (
            <button
              key={tab}
              className="pb-2 border-b-2 border-transparent hover:border-black dark:hover:border-white whitespace-nowrap"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="text-gray-600 dark:text-gray-400 border-b border-zinc-300 dark:border-zinc-700">
              <tr>
                <th className="text-left p-2">Video</th>
                <th className="text-left p-2">Visibility</th>
                <th className="text-left p-2">Restrictions</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Likes</th>
                <th className="text-left p-2">Comments</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr
                  key={video.videoId}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <td className="p-2 flex items-center gap-3 w-72">
                    <img
                      src={`http://localhost:3000${video.thumbnail}`} alt={video.title}
                      className="w-28 h-20 object-cover rounded"
                    />
                    <div className="w-40">
                      <p className="font-semibold truncate">
                        {video.title || "Untitled"}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {video.description || "No Description"}
                      </p>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <BiWorld className="text-gray-400" />
                      Public
                    </div>
                  </td>
                  <td className="p-2">
                    {video.isForKids ? "Made for kids" : "None"}
                  </td>
                  <td className="p-2">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">{video.likes?.length || 0}</td>
                  <td className="p-2">{video.comments?.length || 0}</td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(video)}
                        className="px-3 py-1 rounded-full bg-gray-200 dark:bg-zinc-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.videoId)}
                        className="px-3 py-1 rounded-full bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {videos.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-10">
                    No videos found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 sm:p-8 relative animate-fadeIn">

            {/* Header */}
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
              Edit Video Details
            </h2>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-lg rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentVideo.title}
                onChange={(e) =>
                  setCurrentVideo({ ...currentVideo, title: e.target.value })
                }
                placeholder="Enter video title"
              />
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 text-base rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={currentVideo.description}
                onChange={(e) =>
                  setCurrentVideo({ ...currentVideo, description: e.target.value })
                }
                placeholder="Write your video description"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChannelContent;
