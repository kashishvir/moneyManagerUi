import moment from "moment";
import {Download, LoaderCircle, Coins} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import {useState} from "react";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100/50 pb-3">
                <h5 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Expense Records</h5>
                <button 
                    disabled={loading}
                    className="card-btn hover:scale-[1.02] active:scale-95 disabled:opacity-50" 
                    onClick={handleDownload}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                            <span>Downloading...</span>
                        </>
                    ) : (
                        <>
                            <Download size={14} /> 
                            <span>Export Excel</span>
                        </>
                    )}
                </button>
            </div>

            {transactions && transactions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    {transactions.map((expense) => (
                        <TransactionInfoCard
                            key={expense.id}
                            title={expense.name}
                            icon={expense.icon}
                            date={moment(expense.date).format("Do MMM YYYY")}
                            amount={expense.amount}
                            type="expense"
                            onDelete={() => onDelete(expense.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl mb-3 text-rose-600">
                        <Coins size={22} />
                    </div>
                    <p className="text-sm text-gray-400 font-semibold">No expense transactions yet</p>
                    <p className="text-xs text-gray-400/80 mt-1">Record some expenses to see where your money goes!</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
