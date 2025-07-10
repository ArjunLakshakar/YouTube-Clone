import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { showError, showSuccess } from '../../Service/NotificationService';
import { storeTokenWithExpiry } from '../../Service/auth';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:3000/login"
      : "http://localhost:3000/register";
    try {
      const response = await axios.post(endpoint, formData);
      if (isLogin) {
        showSuccess("Login Successful", "Welcome back!");
        dispatch(addUser(response.data.user));
        storeTokenWithExpiry(response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setFormData({ email: '', password: '' });
        onClose();
      } else {
        showSuccess("Registration Successful", "Now login to continue.");
        setFormData({ username: '', email: '', password: '' });
        setIsLogin(true);
      }
    } catch (error) {
      showError(isLogin ? "Login Failed" : error.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4 ">
      <div className="bg-zinc-900 text-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-5xl"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center pt-10 px-8 ">
          <h2 className="sm:text-3xl xs:text-2xl text-xl font-bold mb-3">
            {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
          </h2>
          {!isLogin && (
            <p className="text-gray-400 xs:text-xl text-xs leading-relaxed">
              Unlock Your World of Entertainment, Unlock Your World of <br className='xs:flex hidden' />
              Entertainment, Join the YouTube Community
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-12 space-y-5 max-w-2xl mx-auto ">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 text-lg bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Passcode"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 text-lg bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 text-lg rounded font-bold bg-red-600 text-white hover:bg-red-500 transition"
          >
            {isLogin ? 'Sign In' : 'Create Your Account'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="sm:text-2xl text-md text-center pb-8 text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-white underline cursor-pointer hover:text-red-400 font-semibold"
          >
            {isLogin ? 'Register' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
