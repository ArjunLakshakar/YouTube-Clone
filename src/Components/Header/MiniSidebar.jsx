import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faScissors,
  faPlay,
  faUser,
  faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MiniSidebarItem = ({ icon, label, onClick }) => (
  <div className="flex flex-col items-center gap-1 px-2 py-4 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
  onClick={onClick} >
    <FontAwesomeIcon icon={icon} className="text-xl" />
    <span className="text-xs">{label}</span>
  </div>
);

const MiniSidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-24 h-screen text-black dark:text-white pt-4 md:flex md:flex-col hidden items-center gap-2 fixed top-16 left-0">
      <MiniSidebarItem icon={faHouse} label="Home" onClick={()=> navigate('/')} />
      <MiniSidebarItem icon={faScissors} label="Shorts" />
      <MiniSidebarItem icon={faPlay} label="Subscriptions" />
      <MiniSidebarItem icon={faUser} label="You" />
      <MiniSidebarItem icon={faClockRotateLeft} label="History" />
    </aside>
  );
};

export default MiniSidebar;
