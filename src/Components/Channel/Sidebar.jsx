import React from "react";
import {
  MdDashboard,
  MdVideoLibrary,
  MdAnalytics,
  MdSubtitles,
  MdLibraryMusic,
  MdSettings,
} from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  return (
    <aside className="lg:w-72 md:w-56 w-16 min-h-[90vh] flex flex-col justify-between md:p-4 p-2 bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-700 text-black dark:text-white text-lg md:flex">
      {/* Top content */}
      <div className="flex flex-col gap-8">
        {/* Channel Info */}
        <div className="flex flex-col md:items-center gap-3">
          <img
            src={
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            }
            alt="Avatar"
            className="md:w-28 md:h-28 w-12 h-12 rounded-full object-cover"
          />
          <h2 className="font-semibold md:flex hidden">Your channel</h2>
          <p className="text-base text-gray-600 dark:text-gray-400 md:flex hidden">
            {user?.username || "Creator"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <NavLink  
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 rounded font-semibold transition cursor-pointer
           ${isActive
                ? "text-blue-600 dark:text-blue-400 scale-[1.02]"
                : "text-gray-600 hover:text-blue-500"}`
            }
          >
            <MdDashboard size={24} />
            <span className="md:flex hidden">Dashboard</span>
          </NavLink>

          <NavLink
            to="/channelContent"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 rounded transition cursor-pointer
           ${isActive
                ? "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white"
                : "text-gray-600 hover:text-white hover:bg-zinc-800"}`
            }
          >
            <MdVideoLibrary size={24} />
            <span className="md:flex hidden">Content</span>
          </NavLink>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer">
            <MdAnalytics size={24} />
            <span className="md:flex hidden">Analytics</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer">
            <MdSubtitles size={24} />
            <span className="md:flex hidden">Subtitles</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer">
            <IoMdColorPalette size={24} />
            <span className="md:flex hidden">Customization</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer">
            <MdLibraryMusic size={24} />
            <span className="md:flex hidden">Audio Library</span>
          </div>
        </nav>
      </div>

      {/* Bottom links */}
      <div className="flex flex-col gap-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-3 hover:text-black dark:hover:text-white cursor-pointer">
          <MdSettings size={24} />
          <span className="md:flex hidden">Settings</span>
        </div>
        <div className="flex items-center gap-3 hover:text-black dark:hover:text-white cursor-pointer">
          <BiMessageSquareDetail size={24} />
          <span className="md:flex hidden">Send feedback</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
