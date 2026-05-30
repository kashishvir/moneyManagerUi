import { useState, useRef, useEffect, useContext } from "react";
import { User, LogOut, X, Menu, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import Sidebar from "./Sidebar.jsx";

const Menubar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { clearUser, user, theme, toggleTheme } = useContext(AppContext);
    const navigate = useNavigate();

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-[var(--panel-bg)] backdrop-blur-md border-b border-white/40 dark:border-white/5 shadow-sm py-3 px-4 sm:px-6 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Left side - Menu button and title */}
                <div className="flex items-center gap-4">
                    <button
                        className="block lg:hidden text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 p-2 rounded-xl transition-colors duration-200 focus:outline-none cursor-pointer"
                        onClick={() => {
                            setOpenSideMenu(!openSideMenu);
                        }}
                    >
                        {openSideMenu ? (
                            <X className="text-xl" size={20} />
                        ) : (
                            <Menu className="text-xl" size={20} />
                        )}
                    </button>

                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-15 group-hover:opacity-40 transition duration-300"></div>
                            <img src={assets.logo} alt="logo" className="relative h-9 w-9 object-contain transform transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <span className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white-900 dark:to-white-800 bg-clip-text tracking-tight">
                            Money Manager
                        </span>
                    </div>
                </div>

                {/* Right side - Theme toggle and Avatar dropdown */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Switch */}
                    <button
                        onClick={toggleTheme}
                        className="relative flex items-center justify-between w-14 h-7.5 bg-gray-200/80 dark:bg-purple-950/30 border border-gray-300/40 dark:border-purple-900/40 rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-none hover:border-purple-400/40 shadow-inner"
                        aria-label="Toggle theme"
                    >
                        <Sun className={`w-3.5 h-3.5 transition-transform duration-300 z-10 ${theme === "light" ? "text-amber-500 scale-110" : "text-gray-400"}`} />
                        <Moon className={`w-3.5 h-3.5 transition-transform duration-300 z-10 ${theme === "dark" ? "text-purple-400 scale-110" : "text-gray-400"}`} />
                        <div
                            className={`absolute top-[2.5px] left-[3px] w-6.5 h-6.5 bg-white dark:bg-purple-600 rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${theme === "dark" ? "translate-x-[24px]" : "translate-x-0"
                                }`}
                        />
                    </button>

                    {/* Avatar dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none cursor-pointer"
                        >
                            {user?.profileImageUrl ? (
                                <img
                                    src={user?.profileImageUrl}
                                    alt="profile"
                                    className="w-9 h-9 rounded-full object-cover border border-purple-100 dark:border-purple-950/30 shadow-sm"
                                />
                            ) : (
                                <div className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full border border-purple-100 shadow-sm">
                                    {getInitials(user?.fullName)}
                                </div>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-gray-150/80 dark:border-white/5 rounded-2xl p-2 shadow-xl z-50 animate-slide-up">
                                {/* User info section */}
                                <div className="px-3 py-3 border-b border-gray-100/50 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {user?.profileImageUrl ? (
                                                <img
                                                    src={user.profileImageUrl}
                                                    alt="profile"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                                                    {getInitials(user?.fullName)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                                {user?.fullName?.toUpperCase() || "USER"}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown options */}
                                <div className="pt-1.5 pb-0.5">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-xl transition-all duration-200 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile side menu */}
            {openSideMenu && (
                <div className="fixed top-[61px] left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 shadow-md lg:hidden z-20 animate-slide-up">
                    <Sidebar activeMenu={activeMenu} />
                </div>
            )}
        </header>
    );
};

export default Menubar;
