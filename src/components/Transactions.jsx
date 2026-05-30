import {ArrowRight} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const Transactions = ({transactions, onMore, type, title}) => {
    return (
        <div className="card h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-5 border-b border-gray-100/50 pb-3">
                    <h5 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">{title}</h5>
                    <button 
                        className="card-btn group hover:scale-[1.02] active:scale-95" 
                        onClick={onMore}
                    >
                        <span>More</span> 
                        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" size={14} />
                    </button>
                </div>

                <div className="space-y-1">
                    {transactions && transactions.length > 0 ? (
                        transactions.slice(0, 5).map(item => (
                            <TransactionInfoCard
                                key={item.id}
                                title={item.name}
                                icon={item.icon}
                                date={moment(item.date).format("Do MMM YYYY")}
                                amount={item.amount}
                                type={type}
                                hideDeleteBtn
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-xs text-gray-400 font-medium">No recent {type}s found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;