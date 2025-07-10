import React, { useState } from 'react';
import Sidebar from './Sidebar';
import UploadModal from '../Header/UploadModal';

const ChannelDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-[90vh] bg-white dark:bg-black text-black dark:text-white ">
            {/* Sidebar for md+ screens */}
            <div className="flex flex-row max-w-6xl">
                <div className="">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full px-4 sm:px-6 md:px-10 lg:px-16">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center md:text-left">
                        Channel dashboard
                    </h1>

                    <div className="border border-gray-300 dark:border-zinc-700 rounded-2xl p-4 sm:p-6 md:p-10 flex justify-center items-center">
                        <div className="flex flex-col justify-center items-center gap-6 text-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl w-full max-w-md p-6 sm:p-8 min-h-[50vh]">
                            <img
                                src="/image.png"
                                alt="No videos"
                                className="w-24 sm:w-28 mx-auto"
                            />
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                Want to see metrics on your recent video?
                                <br />
                                Upload and publish a video to get started.
                            </p>
                            <button
                                className="bg-black text-white dark:bg-white dark:text-black px-5 sm:px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Upload videos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ChannelDashboard;
