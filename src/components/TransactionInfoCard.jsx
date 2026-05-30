import {Trash2, TrendingDown, TrendingUp, UtensilsCrossed} from "lucide-react";
import {addThousandsSeparator} from "../util/util.js";

const TransactionInfoCard = ({icon, title, date, amount, type, hideDeleteBtn, onDelete}) => {
    const isIncome = type === 'income';
    const badgeStyles = isIncome 
        ? 'bg-emerald-50/70 text-emerald-700 border-emerald-100/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
        : 'bg-rose-50/70 text-rose-700 border-rose-100/30 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';

    return (
        <div className="group relative flex items-center gap-4 p-3 rounded-xl border border-gray-200/20 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-sm hover:-translate-y-[1px] transition-all duration-300 mb-2">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shrink-0 shadow-sm">
                {icon ? (
                    <img src={icon} alt={title} className="w-6 h-6 object-contain" />
                ) : (
                    <UtensilsCrossed className="text-purple-600 w-5 h-5" />
                )}
            </div>

            <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{date}</p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    {!hideDeleteBtn && (
                        <button
                            onClick={onDelete}
                            className="text-gray-400 hover:text-rose-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer md:opacity-0 md:group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50"
                            title="Delete transaction"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badgeStyles}`}>
                        <span>
                            {isIncome ? '+': '-'} ₹{addThousandsSeparator(amount)}
                        </span>
                        {isIncome ? (
                            <TrendingUp size={13} className="shrink-0" />
                        ) : (
                            <TrendingDown size={13} className="shrink-0" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionInfoCard;