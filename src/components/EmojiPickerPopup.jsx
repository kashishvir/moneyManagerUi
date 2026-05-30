import {useState, useContext} from "react";
import {Image, X} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {AppContext} from "../context/AppContext.jsx";

const EmojiPickerPopup = ({icon, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {theme} = useContext(AppContext);

    const handleEmojiClick = (emoji) => {
        onSelect(emoji?.imageUrl || "");
        setIsOpen(false);
    }

    return (
        <div className="flex flex-col gap-3 mb-6">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block ml-0.5">
                Category Icon
            </label>
            <div className="w-full flex flex-col gap-4">
                {/* Custom Glassmorphic Selector Button */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-4 p-3 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-gray-200/20 dark:border-white/5 rounded-xl cursor-pointer transition-all duration-300 group shadow-sm w-full sm:w-fit"
                >
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                        {icon ? (
                            <img src={icon} alt="Icon" className="w-8 h-8 object-contain" />
                        ) : (
                            <Image size={20} />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
                            {icon ? "Change Icon" : "Select Icon"}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                            Choose an emoji representation
                        </p>
                    </div>
                </div>

                {/* Full-width Responsive Emoji Picker Wrapper */}
                {isOpen && (
                    <div className="w-full relative animate-slide-up shadow-2xl rounded-2xl border border-gray-200/20 dark:border-white/5 overflow-hidden z-20 bg-white dark:bg-[#08070d]">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-full absolute top-2.5 right-2.5 z-10 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <X size={14} />
                        </button>
                        <EmojiPicker
                            open={isOpen}
                            onEmojiClick={handleEmojiClick}
                            theme={theme}
                            width="100%"
                            height={340}
                            skinTonesDisabled
                            searchPlaceHolder="Search modern icons..."
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmojiPickerPopup;