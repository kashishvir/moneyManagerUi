import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {Search, Funnel} from "lucide-react";
import {useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";

const Filter = () => {
    useUser();
    const [type, setType] = useState("income");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                type,
                startDate,
                endDate,
                keyword,
                sortField,
                sortOrder
            });
            console.log('transactions: ', response.data);
            setTransactions(response.data);
        }catch (error) {
            console.error('Failed to fetch transactions: ', error);
            toast.error(error.message || "Failed to fetch transactions. Please try again.");
        }finally {
            setLoading(false);
        }

    }

    const inputClasses = "w-full bg-white/60 dark:bg-white/5 backdrop-blur-md outline-none border border-gray-200 dark:border-white/5 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 transition-all duration-300 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 focus:bg-white dark:focus:bg-slate-950 focus:text-gray-900 dark:focus:text-white cursor-pointer";
    const labelClasses = "text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5 ml-0.5";

    return (
        <Dashboard activeMenu="Filters">
            <div className="my-6 max-w-[1400px] mx-auto space-y-6">
                {/* Header Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/5 p-5 rounded-2xl shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Search & Filter</h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Query specific transactions by type, date range, sorted parameters, or description keyword.</p>
                    </div>
                </div>

                {/* Filter Controls Card */}
                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-5 border-b border-gray-100/50 pb-3">
                        <Funnel className="text-purple-600" size={16} />
                        <h5 className="text-base font-bold text-gray-900 tracking-tight">Select Filters</h5>
                    </div>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                            <label className={labelClasses} htmlFor="type">Type</label>
                            <select value={type} id="type" className={inputClasses} onChange={e => setType(e.target.value)}>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="startdate" className={labelClasses}>Start Date</label>
                            <input value={startDate} id="startdate" type="date" className={inputClasses} onChange={e => setStartDate(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="enddate" className={labelClasses}>End Date</label>
                            <input value={endDate} id="enddate" type="date" className={inputClasses} onChange={e => setEndDate(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="sortfield" className={labelClasses}>Sort Field</label>
                            <select value={sortField} id="sortfield" className={inputClasses} onChange={e => setSortField(e.target.value)}>
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="category">Category</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sortorder" className={labelClasses}>Sort Order</label>
                            <select value={sortOrder} id="sortorder" className={inputClasses} onChange={e => setSortOrder(e.target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end">
                            <label htmlFor="keyword" className={labelClasses}>Keyword</label>
                            <div className="relative flex items-center">
                                <input 
                                    value={keyword} 
                                    id="keyword" 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="w-full bg-white/60 dark:bg-white/5 backdrop-blur-md outline-none border border-gray-200 dark:border-white/5 rounded-xl py-2.5 pl-3.5 pr-10 text-xs sm:text-sm text-gray-700 dark:text-gray-200 transition-all duration-300 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 focus:bg-white dark:focus:bg-slate-950 focus:text-gray-900 dark:focus:text-white" 
                                    onChange={e => setKeyword(e.target.value)} 
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-1.5 w-8 h-8 bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95 text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm"
                                    title="Apply filter"
                                >
                                    <Search size={14} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Transactions Result Card */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-5 border-b border-gray-100/50 pb-3">
                        <h5 className="text-base font-bold text-gray-900 tracking-tight">Filtered Transactions</h5>
                        {transactions.length > 0 && (
                            <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100/35">
                                {transactions.length} matches
                            </span>
                        )}
                    </div>
                    
                    {transactions.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-14 h-14 flex items-center justify-center bg-purple-50 rounded-2xl mb-3 text-purple-600">
                                <Search size={22} />
                            </div>
                            <p className="text-sm text-gray-400 font-semibold">No filter criteria applied</p>
                            <p className="text-xs text-gray-400/80 mt-1">Configure your variables above and click Search to query transactions.</p>
                        </div>
                    )}
                    
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 border-2 border-purple-600/20 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Loading transactions...</p>
                        </div>
                    )}
                    
                    {!loading && transactions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                            {transactions.map((transaction) => (
                                <TransactionInfoCard
                                    key={transaction.id}
                                    title={transaction.name}
                                    icon={transaction.icon}
                                    date={moment(transaction.date).format('Do MMM YYYY')}
                                    amount={transaction.amount}
                                    type={type}
                                    hideDeleteBtn
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    )
}

export default Filter;