import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserInfo } from "../../redux/userSlice";
import { showError, showSuccess } from "../../Service/NotificationService";

const ChannelSettings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        bannerImage: "",
        profileImage: "",
        name: "",
        handle: "",
        description: "",
        watermark: "",
    });
    const MAX_NAME_LENGTH = 18;
    const MAX_HANDLE_LENGTH = 15;
    const MAX_DESCRIPTION_LENGTH = 300;

    useEffect(() => {
        fetchChannelData();
    }, []);

    const fetchChannelData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("Token missing!");

        try {
            const res = await axios.get("http://localhost:3000/getChannel", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const channelData = res.data?.channel;
            if (!channelData) return;

            setForm((prev) => ({
                ...prev,
                bannerImage: channelData.channelBanner || "",
                profileImage: channelData.profileImage || "",
                name: channelData.channelName || "",
                handle: channelData.handle || "",
                description: channelData.description || "",
                watermark: channelData.watermark || "",
            }));
        } catch (error) {
            console.error("Error fetching channel data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" && value.length > MAX_NAME_LENGTH) return;
        if (name === "handle" && value.length > MAX_HANDLE_LENGTH) return;
        if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) return;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.put("http://localhost:3000/updateChannel", {
                bannerImage: form.bannerImage,
                profileImage: form.profileImage,
                name: form.name,
                handle: form.handle,
                description: form.description,
                watermark: form.watermark,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            showSuccess("Change Successful", "Channel info saved successfully!");
            dispatch(updateUserInfo(form));
        } catch (error) {
            console.error(error);
            showError("Error", error.response?.data?.message || "Error submitting form");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex-1 px-4 sm:px-8 py-6 bg-white dark:bg-black text-black dark:text-white shadow-sm"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 dark:border-zinc-700 mb-6 pb-4 gap-4">
                <div className="flex gap-6 text-lg">
                    <button type="button" className="pb-2 border-b-2 font-semibold border-black dark:border-white">Profile</button>
                    <button type="button" className="pb-2 font-semibold text-gray-500 dark:text-gray-400">Home tab</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button type="button" onClick={() => navigate(-1)} className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 rounded-full font-semibold">View Channel</button>
                    <button type="button" onClick={fetchChannelData} className="py-2 px-4 bg-gray-200 dark:bg-zinc-700 rounded-full font-semibold">Cancel</button>
                    <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500">Publish</button>
                </div>
            </div>

            {/* Banner Image Section */}
            <div className="flex flex-col gap-4 mb-10 max-w-4xl">
                <h2 className="text-xl font-medium">Banner image</h2>
                <p className="text-base text-gray-500 dark:text-gray-400">This image will appear across the top of your channel</p>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2 h-48 border bg-gray-200 dark:border-gray-500 dark:bg-zinc-800 flex justify-center items-center overflow-hidden">
                        {form.bannerImage ? (
                            <img
                                src={form.bannerImage}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500">No Banner Uploaded</span>
                        )}
                    </div>
                    <div className="w-full lg:w-1/2">
                        <p className="text-base text-gray-500 dark:text-gray-400">
                            For the best results on all devices, use an image that’s at least 2048 x 1152 pixels and 6MB or less.
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <label className="bg-gray-200 dark:bg-zinc-800 px-4 py-1 rounded-full cursor-pointer">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="bannerImage"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <button type="button" onClick={() => setForm((prev) => ({ ...prev, bannerImage: "" }))} className="bg-gray-200 dark:bg-zinc-800 px-4 py-1 rounded-full">Remove</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col gap-4 mb-10 max-w-4xl">
                <h2 className="text-xl font-medium">Picture</h2>
                <p className="text-base text-gray-500 dark:text-gray-400">
                    Your profile picture will appear where your channel is presented on YouTube, like next to your videos and comments
                </p>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2 flex justify-center items-center border h-48 bg-gray-200 dark:border-gray-500 dark:bg-zinc-800">
                        <img
                            src={form.profileImage || "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"}
                            alt="Avatar"
                            className="h-44 rounded-full"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <p className="text-base text-gray-500 dark:text-gray-400">
                            It’s recommended to use a picture that’s at least 98 x 98 pixels and 4MB or less.
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <label className="bg-gray-200 dark:bg-zinc-800 px-4 py-1 rounded-full cursor-pointer">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="profileImage"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <button type="button" onClick={() => setForm((prev) => ({ ...prev, profileImage: "" }))} className="bg-gray-200 dark:bg-zinc-800 px-4 py-1 rounded-full">Remove</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="mb-8 max-w-4xl">
                <label className="block font-medium mb-1 text-lg">Name</label>
                <p className="text-base text-gray-500 dark:text-gray-400">Choose a name for your channel. Changes only affect YouTube.</p>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-600"
                />
            </div>

            {/* Handle */}
            <div className="mb-8 max-w-4xl">
                <label className="block font-medium mb-1 text-lg">Handle</label>
                <p className="text-base text-gray-500 dark:text-gray-400">
                    Your unique channel URL: https://youtube.com/@yourhandle
                </p>
                <input
                    type="text"
                    name="handle"
                    value={form.handle}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-600"
                />
            </div>

            {/* Description */}
            <div className="mb-8 max-w-4xl">
                <label className="block font-medium mb-1 text-lg">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-600"
                />
            </div>
        </form>
    );
};

export default ChannelSettings;
