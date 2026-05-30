import React from "react";
import {X} from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full p-4 overflow-hidden bg-slate-950/50 dark:bg-black/75 backdrop-blur-lg transition-opacity duration-300"
        >
            <div className="relative w-full max-w-[560px] max-h-[85vh] flex flex-col animate-slide-up">
                {/* Modal box */}
                <div className="relative flex flex-col bg-white/80 dark:bg-[#0c0a18]/85 backdrop-blur-2xl border border-white/60 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100/50 dark:border-white/5 bg-white/20 dark:bg-white/2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                            {title}
                        </h3>

                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-1.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-[calc(85vh-70px)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
