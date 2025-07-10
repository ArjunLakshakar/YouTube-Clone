import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faBars, faUser, faHouse, faFilm, faClockRotateLeft, faScissors, faPlay, faVideo,
    faGamepad, faMusic, faShop, faTrophy, faCompass, faGear, faFlag, faCircleQuestion, faCommentDots,
    faGraduationCap, faShirt, faPodcast, faMoneyCheckDollar, faCircleInfo, faMoon, faGlobeAsia,
    faArrowRightFromBracket, faKeyboard, faLanguage,
    faSearch,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../Sign/AuthModal';
import { clearToken } from '../../Service/auth';
import CreateChannelModal from '../Channel/CreateChannelModal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import UploadModal from './UploadModal';
import { removeUser } from '../../redux/userSlice';
import { ModalContext } from '../../Service/ModelContext';

function Navbar() {
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [channelModalOpen, setChannelModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const avatarMenuRef = useRef();
    const createMenuRef = useRef();
    const user = useSelector((state) => state.user?.user);
    const token = localStorage.getItem('token');

    const { showSidebar, setShowSidebar } = useContext(ModalContext);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
                setShowAvatarMenu(false);
            }
        }
        if (showAvatarMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAvatarMenu]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
                setShowCreateDropdown(false);
            }
        }

        if (showCreateDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCreateDropdown]);

    const handleSearch = () => {
        const trimmed = searchInput.trim();
        if (trimmed.length === 0) return; // Prevent search if empty
        navigate(`/search/${encodeURIComponent(trimmed)}`);
        setSearchTerm('');
    };

    // For sideBar
    function SidebarItem({ icon, iconSrc, label, active, onClick }) {
        return (
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${active ? 'dark:bg-gray-700 bg-gray-200' : 'dark:hover:bg-zinc-800'}`} onClick={onClick}>
                {icon && <FontAwesomeIcon icon={icon} />}
                {iconSrc && <img src={iconSrc} alt={label} className="w-4 h-4" />}
                <span className='text-md'>{label}</span>
            </div>
        );
    }

    const MenuItem = ({ icon, label, className = '', onClick }) => (
        <li className={`flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 px-2 py-1 rounded-md ${className}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} className="text-base" />
            <span>{label}</span>
        </li>
    );

    return (
        <>
            {!showMobileSearch &&
                <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between xs:py-4 py-2 xs:h-24 h-20  lg:px-7 px-4 dark:bg-black bg-white dark:text-white text-2xl ">
                    {/* Burger + Logo */}
                    <div className='flex items-center gap-8'>
                        <FontAwesomeIcon
                            icon={faBars}
                            className='text-2xl cursor-pointer'
                            onClick={() => setShowSidebar(!showSidebar)}
                        />
                        <div className='flex gap-1'>
                            <img src="https://cdn-icons-png.flaticon.com/128/10090/10090287.png" alt="YouTube" className='w-10 h-10 ' />
                            <h1 className='xs:flex hidden font-oswald text-3xl'>YouTube</h1>
                        </div>
                    </div>

                    {/* Search Icon for Mobile */}
                    <div className="md:hidden ml-auto md:mx-4 mx-2">
                        <FontAwesomeIcon icon={faSearch} className='text-xl cursor-pointer' onClick={() => setShowMobileSearch(!showMobileSearch)} />
                    </div>

                    {/* Search Bar */}
                    <form
                        className="md:flex hidden items-center llg:w-full md:w-2/6 w-1/4 max-w-xl mx-4 bg-white border-gray-400 dark:bg-zinc-900 border dark:border-gray-600 rounded-full px-4 py-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}>
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-transparent placeholder-gray-400 outline-none px-2"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                const trimmed = searchInput.trim();
                                if (e.key === 'Enter') {
                                    if (trimmed.length === 0) return; 
                                    navigate(`/search/${encodeURIComponent(trimmed)}`);
                                }
                            }}
                        />

                        <img
                            src="https://cdn-icons-png.flaticon.com/128/3031/3031293.png"
                            alt="search"
                            className="w-6 h-6 cursor-pointer"
                            onClick={handleSearch}
                        />
                    </form>

                    {/* Right Side */}
                    {token ? (
                        <div className='flex items-center gap-6'>
                            {/* Create Button */}
                            <div className='relative'>
                                <div
                                    className='cursor-pointer px-4 py-1 text-lg font-semibold dark:bg-zinc-800 bg-gray-100 rounded-full flex items-center justify-center'
                                    onClick={() => setShowCreateDropdown(prev => !prev)}
                                >
                                    <span className='px-1 sm:flex hidden'> + </span> Create
                                </div>

                                {/* Dropdown */}
                                {showCreateDropdown && (
                                    <div ref={createMenuRef} className='absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg rounded-lg z-50'>
                                        {user?.channels && user.channels.length > 0 ? (
                                            <div
                                                className='px-4 py-2 hover:bg-gray-100 text-xl dark:hover:bg-zinc-800 cursor-pointer'
                                                onClick={() => {
                                                    setShowCreateDropdown(false);
                                                    setIsModalOpen(true); // open UploadModal
                                                }}
                                            >
                                                Upload video
                                            </div>
                                        ) : (
                                            <div
                                                className=' sm:px-4 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer'
                                                onClick={() => {
                                                    setShowCreateDropdown(false);
                                                    setChannelModalOpen(true); // open CreateChannelModal
                                                }}
                                            >
                                                Create channel
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <FontAwesomeIcon icon={faBell} className='hidden text-xl cursor-pointer' />
                            <div className='flex flex-col gap-1 justify-center items-center'>
                                <img
                                    // src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                                    alt="avatar"
                                    className='w-9 h-9 rounded-full cursor-pointer  object-cover'
                                    onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                                />
                                <p className='xs:flex flex-wrap hidden text-base'>Hi,{user.username?.length > 12
                                    ? `${user.username.slice(0, 12)}..`
                                    : user.username || "Guest"}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center gap-3 border py-1 px-3 rounded-full '>
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                                alt="avatar"
                                className='w-7 h-7 rounded-full cursor-pointer'
                                onClick={() => setAuthModalOpen(true)}
                            />
                            <div className='text-md cursor-pointer' onClick={() => setAuthModalOpen(true)}>Sign in</div>
                        </div>
                    )}

                    {/* login and sign-up */}
                    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
                    {/* Create channel */}
                    <CreateChannelModal isOpen={channelModalOpen} onClose={() => setChannelModalOpen(false)} />
                    {/* Upload Videos */}
                    <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                    {/* Sidebar */}
                    {showSidebar && (
                        <div className='absolute top-16 left-0 xsm:w-80 w-60 xsm:text-xl text-lg h-screen overflow-y-auto dark:bg-zinc-900 bg-white dark:text-white shadow-lg p-4 z-50 space-y-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600'>
                            <div className='space-y-2'>
                                <SidebarItem icon={faHouse} label="Home" active className="text-2xl" onClick={() => { navigate('/'); setShowSidebar(false); }} />
                                <SidebarItem icon={faScissors} label="Shorts" />
                                <SidebarItem icon={faPlay} label="Subscriptions" />
                            </div>
                            <hr className='border-gray-700 my-2' />
                            <div className='space-y-2'>
                                <SidebarItem icon={faUser} label="You" />
                                <SidebarItem icon={faClockRotateLeft} label="History" />
                            </div>
                            <hr className='border-gray-700 my-3' />
                            <div className='space-y-2 hidden'>
                                <p className='text-md mt-3'>Sign in to like videos, comment and subscribe.</p>
                                <button className='border border-blue-500 text-blue-500 rounded-full px-3 py-1 text-sm'>
                                    <FontAwesomeIcon icon={faUser} className='mr-1' /> Sign in
                                </button>
                                <hr className='border-gray-700 my-3' />
                            </div>

                            <div>
                                <h2 className='font-semibold text-md mb-2'>Explore</h2>
                                <div className='space-y-2'>
                                    <SidebarItem icon={faCompass} label="Trending" />
                                    <SidebarItem icon={faShop} label="Shopping" />
                                    <SidebarItem icon={faMusic} label="Music" />
                                    <SidebarItem icon={faFilm} label="Films" />
                                    <SidebarItem icon={faVideo} label="Live" />
                                    <SidebarItem icon={faGamepad} label="Gaming" />
                                    <SidebarItem icon={faTrophy} label="Sport" />
                                </div>
                            </div>
                            <hr className='border-gray-700 my-3' />
                            <div>
                                <SidebarItem icon={faGraduationCap} label="Courses" />
                                <SidebarItem icon={faShirt} label="Fashion & beauty" />
                                <SidebarItem icon={faPodcast} label="Podcasts" />
                            </div>
                            <hr className='border-gray-700 my-3' />
                            <div>
                                <h2 className='font-semibold text-sm mb-2'>More from YouTube</h2>
                                <SidebarItem iconSrc="https://cdn-icons-png.flaticon.com/128/1384/1384060.png" label="YouTube Premium" />
                                <SidebarItem iconSrc="https://cdn-icons-png.flaticon.com/128/15047/15047447.png" label="YouTube Music" />
                                <SidebarItem iconSrc="https://cdn-icons-png.flaticon.com/128/733/733585.png" label="YouTube Kids" />
                            </div>
                            <hr className='border-gray-700 my-3' />
                            <div>
                                <SidebarItem icon={faGear} label="Settings" />
                                <SidebarItem icon={faFlag} label="Report history" />
                                <SidebarItem icon={faCircleQuestion} label="Help" />
                                <SidebarItem icon={faCommentDots} label="Send feedback" />
                            </div>
                            <hr className='border-gray-700 my-3' />
                            <div className='text-xs text-gray-400 space-y-1 leading-relaxed'>
                                <p>About Press Copyright</p>
                                <p>Contact us Creator Advertise</p>
                                <p>Developers</p>
                                <p className='mt-2'>Terms Privacy Policy & Safety</p>
                                <p>How YouTube works</p>
                                <p>Test new features</p>
                                <p className='pt-2'>&copy; 2025 Google LLC</p>
                            </div>
                        </div>
                    )}

                    {/* Avatar Dropdown */}
                    {showAvatarMenu && (
                        <div ref={avatarMenuRef} className='absolute md:right-24 md:top-0 top-16 right-8 mt-2 xsm:w-80 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4'>
                            <div className='flex items-center gap-3 mb-4'>
                                <img
                                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/128/1144/1144760.png"}
                                    alt="avatar"
                                    className='w-10 h-10 rounded-full dark:bg-gray-500'
                                />
                                <div>
                                    <h2 className='font-semibold'>{user.username?.length > 12
                                        ? `${user.username.slice(0, 12)}..`
                                        : user.username}</h2>
                                    <p className='text-sm text-gray-400'>{user.handle?.length > 12
                                        ? `${user.handle.slice(0, 12)}..`
                                        : "No Channel"
                                    }</p>
                                </div>
                            </div>
                            <ul className='space-y-2 sm:text-lg text-base'>
                                {
                                    user.channels && user.channels.length > 0 ?
                                        <li className='cursor-pointer text-violet-800' onClick={() => { navigate('/channel'); setShowAvatarMenu(false) }}>View your channel</li>
                                        :
                                        <li className='cursor-pointer text-violet-800' onClick={() => { setChannelModalOpen(true); setShowAvatarMenu(false) }}>Create channel</li>
                                }

                                <hr className='border-gray-700 my-3' />
                                <MenuItem
                                    icon={faYoutube}
                                    label="YouTube Studio"
                                    onClick={() => {
                                        if (user?.channels?.length !== 0) {
                                            navigate('/dashboard');
                                            setShowAvatarMenu(false)
                                        } else {
                                            setChannelModalOpen(true);
                                        }
                                    }}
                                />


                                <MenuItem icon={faMoneyCheckDollar} label="Purchases and memberships" />
                                <hr className='border-gray-700 my-3' />
                                <MenuItem icon={faCircleInfo} label="Your data in YouTube" />
                                <MenuItem icon={faMoon} label={`Appearance: ${darkMode ? "Dark" : "Light"} mode`} onClick={toggleDarkMode} />
                                <MenuItem icon={faLanguage} label="Language: English" />
                                <MenuItem icon={faGlobeAsia} label="Location: India" />
                                <MenuItem icon={faKeyboard} label="Keyboard shortcuts" />
                                <hr className='border-gray-700 my-3' />
                                <MenuItem icon={faGear} label="Settings" />
                                <hr className='border-gray-700 my-3' />
                                <MenuItem icon={faArrowRightFromBracket} label="Sign out" onClick={() => {
                                    clearToken();
                                    dispatch(removeUser());
                                    setShowAvatarMenu(false);
                                    navigate('/');
                                }} />
                            </ul>
                        </div>
                    )}
                </nav>
            }

            {/* Mobile Search Mode */}
            {showMobileSearch && (
                <nav className="fixed top-0 left-0 w-full z-[1000] px-4 xs:py-7 py-5 text-xl dark:text-white text-black bg-white dark:bg-black flex items-center gap-6">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="text-xl cursor-pointer"
                        onClick={() => setShowMobileSearch(false)}
                    />
                    <div className='w-full bg-white border-gray-400 dark:bg-zinc-900 border dark:border-gray-600 rounded-full xs:px-6 px-3 py-2 flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-grow bg-transparent outline-none text-xl px-2"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && searchInput.trim()) {
                                    navigate(`/search/${encodeURIComponent(searchInput.trim())}`);
                                    setShowMobileSearch(false);
                                }
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="text-xl cursor-pointer"
                            onClick={() => {
                                handleSearch();
                                setShowMobileSearch(false);
                            }}
                        />
                    </div>

                </nav>
            )}
        </>
    );
}

export default Navbar;
