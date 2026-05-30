import {useState} from "react";
import {LoaderCircle, AlertTriangle} from "lucide-react";

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        }finally {
            setLoading(false);
        }
    }
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 rounded-xl shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Confirm Deletion</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{content}</p>
                </div>
            </div>
            
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl px-4 py-2.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:shadow-rose-500/20 hover:-translate-y-[1px] disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Deleting...</span>
                        </>
                    ): (
                        "Confirm Delete"
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;