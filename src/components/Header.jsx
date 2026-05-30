import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { Sun, Moon } from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(AppContext);

    return (
        <div className="w-full relative z-20 flex items-center justify-between px-6 sm:px-12 py-5 bg-transparent">
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate("/")}
            >
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <img
                        src={assets.logo}
                        alt="logo"
                        className="relative h-9 w-9 object-contain transform transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent tracking-tight">
                    Money Manager
                </span>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium select-none">
                    Smart financial tracking
                </span>
                
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
            </div>
        </div>
    );
};

export default Header;