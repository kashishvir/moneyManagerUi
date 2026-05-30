import {useRef, useState} from "react";
import {Trash, Upload, User} from "lucide-react";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    }

    return (
        <div className="flex justify-center mb-6">
            <input type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <div className="w-24 h-24 flex items-center justify-center bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-full relative group shadow-inner">
                    <User className="text-purple-400 dark:text-purple-500/80" size={36} />

                    <button
                        onClick={onChooseFile}
                        className="w-8.5 h-8.5 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full absolute -bottom-1 -right-1 shadow-md hover:scale-105 active:scale-95 duration-200 transition-all cursor-pointer border border-white dark:border-[#0f0e17]"
                        title="Upload Photo"
                    >
                        <Upload size={14} />
                    </button>
                </div>
            ) : (
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <img 
                        src={previewUrl} 
                        alt="profile preview" 
                        className="relative w-24 h-24 rounded-full object-cover border border-white dark:border-[#0f0e17] shadow-md transition-transform duration-300 group-hover:scale-102" 
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="relative z-10 w-8.5 h-8.5 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-full absolute -bottom-1 -right-1 shadow-md hover:scale-105 active:scale-95 duration-200 transition-all cursor-pointer border border-white dark:border-[#0f0e17]"
                        title="Remove Photo"
                    >
                        <Trash size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector;