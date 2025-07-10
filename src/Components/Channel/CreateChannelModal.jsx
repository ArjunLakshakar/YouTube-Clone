import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/userSlice';
import { showError, showInfo, showSuccess } from '../../Service/NotificationService';

const CreateChannelModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.user);
    const [form, setForm] = useState({
        channelName: user?.username || '',
        handle: `@${user?.username}-x6i`,
    });

    useEffect(() => {
        if (user) {
            setForm({
                channelName: user.username || '',
                handle: `@${user.username}-x6i`,
            });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isOpen) return null;

    const createChannel = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showInfo('Login Requried', 'Please login to continue.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/createChannel',
                {
                    channelName: form.channelName,
                    handle: form.handle,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showSuccess('Channel Created', 'Channel created successfully!')
            dispatch(updateUser(form.handle));
            setForm({
                channelName: '',
                handle: '',
            });
            onClose();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            showError('Failed !', error.response?.message || 'Failed to create channel.')
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full max-w-4xl rounded-xl shadow-lg p-6 relative flex flex-col justify-between min-h-[80vh] max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 ">How you'll appear</h2>

                    <div className="flex flex-col items-center mt-10">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="avatar"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full"
                        />
                        <button className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
                            Select picture
                        </button>
                    </div>

                    <div className="space-y-4 mt-8 max-w-lg m-auto text-xl sm:text-md">
                        <div className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-lg sm:p-3 p-2">
                            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Name</label>
                            <input
                                name="channelName"
                                type="text"
                                value={form.channelName}
                                onChange={handleChange}
                                className="w-full bg-transparent focus:outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <div className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-lg sm:p-3 p-2">
                            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Handle</label>
                            <input
                                name="handle"
                                type="text"
                                value={form.handle}
                                onChange={handleChange}
                                className="w-full bg-transparent focus:outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
                        By clicking <strong>Create channel</strong>, you agree to YouTube's Terms of Service.
                        <span className="text-blue-600 dark:text-blue-400 hover:underline ml-1 cursor-pointer">Learn more</span>
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-6 sm:text-2xl text-lg">
                    <button
                        className="sm:px-4 px-2 py-2 rounded-md transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="sm:px-4 px-2 py-2 rounded-md  text-blue-500 hover:opacity-90 transition font-medium"
                        onClick={createChannel}
                    >
                        Create channel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateChannelModal;
