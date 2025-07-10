import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-center flex flex-col justify-center items-center px-4">
      <img
        src="https://i.imgur.com/qIufhof.png"
        alt="404"
        className="w-64 sm:w-80 mb-6"
      />
      <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
        Oops! Page not found.
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-6 max-w-xl">
        The page you're looking for doesn't exist, has been moved, or the URL is incorrect.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
