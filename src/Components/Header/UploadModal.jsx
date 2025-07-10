import axios from 'axios';
import React, { useState, useRef } from 'react';
import { BsUpload } from 'react-icons/bs';
import { showError, showSuccess } from '../../Service/NotificationService';

const initialFormState = {
  title: '',
  description: '',
  videoFile: null,
  thumbnailFile: null,
  thumbnailPreview: null,
  category: '',
  isForKids: 'no',
};

const UploadModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(initialFormState);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const videoURLRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, videoFile: file }));
      setShowDetailsForm(true);
      videoURLRef.current = URL.createObjectURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          thumbnailFile: file,
          thumbnailPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, videoFile, thumbnailFile, category } = form;
    if (!title || !description || !videoFile || !thumbnailFile || !category) {
      return showError('Missing Fields', 'All required fields must be filled.');
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return showError('Unauthorized', 'Login to upload a video.');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', videoFile);
      formData.append('thumbnail', thumbnailFile);
      formData.append('category', category);
      formData.append('isForKids', form.isForKids);

      await axios.post('http://localhost:3000/addChannelVideo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('Success', 'Video uploaded successfully!');
      handleClose();
    } catch (err) {
      showError('Upload Error', err?.response?.data?.error || 'Something went wrong.');
      handleClose();
    }
  };

  const handleClose = () => {
    setForm(initialFormState);
    videoURLRef.current = null;
    setShowDetailsForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg w-full max-w-5xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">

        {/* for upload video and data */}
        {!showDetailsForm ? (
          <div className="flex flex-col justify-between min-h-[80vh]">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Upload Video</h1>
                <button onClick={handleClose} className="text-3xl">&times;</button>
              </div>
              <hr className="border-gray-300 dark:border-zinc-700 my-3" />
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <div className="rounded-full bg-gray-100 dark:bg-zinc-900 w-40 h-40 flex justify-center items-center p-4">
                <BsUpload size={40} />
              </div>
              <p className="text-lg font-semibold">Drag and drop video files to upload</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your videos will be private until published.</p>
              <div>
                <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" id="uploadVideoInput" />
                <label htmlFor="uploadVideoInput" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full cursor-pointer hover:opacity-80 transition">
                  Select Files
                </label>
              </div>
            </div>

            <div className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
              <p>
                By submitting your videos, you agree to our <span className="text-blue-600 dark:text-blue-400">Terms</span> & <span className="text-blue-600 dark:text-blue-400">Community Guidelines</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-sm md:text-base">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-semibold">Video Details</h2>
                <button onClick={handleClose} className="text-3xl">&times;</button>
              </div>
              <hr className="border-gray-300 dark:border-zinc-700 my-3" />

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Section */}
                <div className="flex-1 space-y-5">
                  <div className="border border-gray-300 dark:border-zinc-700 p-3 rounded-xl">
                    <label className="block text-sm mb-1">Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full bg-white dark:bg-zinc-800 px-3 py-2 rounded outline-none" placeholder="Add a title" required />
                  </div>

                  <div className="border border-gray-300 dark:border-zinc-700 p-3 rounded-xl">
                    <label className="block mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-white dark:bg-zinc-800 px-3 py-2 rounded outline-none" rows="4" placeholder="Tell viewers about your video" required />
                  </div>

                  <div>
                    <label className="block mb-1">Thumbnail</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="bg-gray-100 dark:bg-zinc-800 border border-dashed border-gray-300 dark:border-zinc-600 w-full h-32 flex items-center justify-center text-sm cursor-pointer rounded">
                        {form.thumbnailPreview ? (
                          <img src={form.thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded" />
                        ) : (
                          "Upload file"
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <div className="hidden sm:flex items-center justify-center text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 border border-dashed border-gray-300 dark:border-zinc-600 rounded h-32">Auto-generated</div>
                      <div className="hidden sm:flex items-center justify-center text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 border border-dashed border-gray-300 dark:border-zinc-600 rounded h-32">Test & compare</div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} required className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-3 py-2 rounded">
                      <option value="">Select</option>
                      <option value="music">Music</option>
                      <option value="gaming">Gaming</option>
                      <option value="news">News</option>
                      <option value="live">Live</option>
                      <option value="sports">Sports</option>
                      <option value="movies">Movies</option>
                      <option value="education">Education</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-300 dark:border-zinc-700">
                    <p className="font-semibold mb-2">Audience</p>
                    <p className="text-sm mb-2">Is this video made for kids?</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="isForKids" value="yes" checked={form.isForKids === 'yes'} onChange={handleChange} />
                        Yes, it’s made for kids
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="isForKids" value="no" checked={form.isForKids === 'no'} onChange={handleChange} />
                        No, it’s not made for kids
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Preview */}
                <div className="w-full lg:w-2/5 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl p-4">
                  {form.videoFile ? (
                    <>
                      <video controls src={videoURLRef.current} className="w-full rounded mb-2" />
                      <p className="text-xs text-gray-500 mb-2">Video Link</p>
                      <p className="text-blue-500 underline text-sm mb-4">https://example.com/video-link</p>
                      <p className="text-xs text-gray-400">Filename</p>
                      <p className="break-all">{form.videoFile.name}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">No video selected</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t border-gray-300 dark:border-zinc-700 pt-4 gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">✔ Checks complete. No issues found.</p>
                <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium hover:opacity-90 transition">
                  Submit Video
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
