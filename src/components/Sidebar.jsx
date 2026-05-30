import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    // Get initials for profile placeholder
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
        <div className="w-64 h-[calc(100vh-73px)] glass-panel border-r border-gray-200/30 dark:border-white/5 p-5 sticky top-[73px] z-20 flex flex-col justify-between">
            <div>
                {/* Profile section */}
                <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-8 p-4 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-2xl shadow-sm">
                    {user?.profileImageUrl ? (
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                            <img
                                src={user?.profileImageUrl}
                                alt="profile image"
                                className="relative w-16 h-16 object-cover bg-slate-100 dark:bg-slate-900 rounded-full border border-white dark:border-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 flex items-center justify-center text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-md border border-white dark:border-slate-800">
                            {getInitials(user?.fullName)}
                        </div>
                    )}
                    <h5 className="text-gray-900 dark:text-gray-100 font-semibold leading-5 text-center mt-1 truncate w-full px-2">
                        {user?.fullName?.toUpperCase() || "USER"}
                    </h5>
                    <p className="text-[11px] text-gray-800 dark:text-gray-400 truncate w-full text-center">
                        {user?.email || ""}
                    </p>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="space-y-1.5">
                    {SIDE_BAR_DATA.map((item, index) => {
                        const isActive = activeMenu === item.label;
                        return (
                            <button
                                onClick={() => navigate(item.path)}
                                key={`menu_${index}`}
                                className={`group cursor-pointer w-full flex items-center gap-4 text-sm py-3 px-5 rounded-xl transition-all duration-300 ${isActive
                                    ? "text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-indigo-600/20 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-500/5 dark:hover:bg-purple-500/10 hover:translate-x-1"
                                    }`}
                            >
                                <item.icon className={`text-lg transition-transform duration-300 ${isActive ? "scale-105" : "group-hover:scale-110 text-gray-400 group-hover:text-purple-500"}`} size={18} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Version stamp / footer */}
            <div className="text-center text-[10px] text-gray-400/80 dark:text-gray-600 font-medium pb-2 select-none">
                Money Manager v1.2.0
            </div>
        </div>
    )
}

export default Sidebar;