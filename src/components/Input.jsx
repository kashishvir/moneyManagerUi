import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

const Input = ({label, value, onChange, placeholder, type, isSelect, options}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <div className="mb-4 text-left">
            {label && (
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5 ml-0.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {isSelect ? (
                    <select
                        className="w-full bg-white/60 dark:bg-white/5 backdrop-blur-md outline-none border border-gray-200 dark:border-white/5 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 dark:text-gray-200 transition-all duration-300 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 focus:bg-white dark:focus:bg-slate-950 focus:text-gray-900 dark:focus:text-white cursor-pointer"
                        value={value}
                        onChange={(e) => onChange(e)}
                    >
                        {options.map((option) => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                className="bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-200"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                ): (
                    <input
                        className={`w-full bg-white/60 dark:bg-white/5 backdrop-blur-md outline-none border border-gray-200 dark:border-white/5 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 dark:text-gray-200 transition-all duration-300 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 focus:bg-white dark:focus:bg-slate-950 focus:text-gray-900 dark:focus:text-white ${
                            type === 'password' ? 'pr-10' : ''
                        }`}
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)} 
                    />
                )}

                {type === 'password' && (
                    <button 
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <Eye size={18} />
                        ) : (
                            <EyeOff size={18} />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input;