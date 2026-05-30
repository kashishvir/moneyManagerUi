import {Layers2, Pencil} from "lucide-react";

const CategoryList = ({categories, onEditCategory}) => {
    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100/50 pb-3">
                <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Category Sources</h4>
                <span className="text-xs text-gray-500 font-medium">{categories.length} total categories</span>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 flex items-center justify-center bg-purple-50 rounded-2xl mb-3 text-purple-600">
                        <Layers2 size={24} />
                    </div>
                    <p className="text-sm text-gray-400 font-semibold">No categories added yet</p>
                    <p className="text-xs text-gray-400/80 mt-1">Add some categories to organize your finances!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                        const isIncome = category.type === 'income';
                        const badgeStyle = isIncome 
                            ? 'text-emerald-700 bg-emerald-50/70 border-emerald-100/30 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' 
                            : 'text-rose-700 bg-rose-50/70 border-rose-100/30 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20';

                        return (
                            <div
                                key={category.id}
                                className="group relative flex items-center gap-4 p-4 rounded-2xl border border-gray-200/20 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300"
                            >
                                {/* Icon/Emoji display */}
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                                    {category.icon ? (
                                        <img src={category.icon} alt={category.name} className="h-6 w-6 object-contain" />
                                    ) : (
                                        <Layers2 className="text-purple-600 w-5 h-5" />
                                    )}
                                </div>

                                {/* Category Details */}
                                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                            {category.name}
                                        </p>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border inline-block mt-1 ${badgeStyle}`}>
                                            {category.type}
                                        </span>
                                    </div>
                                    
                                    {/* Action buttons */}
                                    <div className="flex items-center shrink-0">
                                        <button
                                            onClick={() => onEditCategory(category)}
                                            className="text-gray-400 hover:text-indigo-600 hover:scale-115 active:scale-95 transition-all duration-200 cursor-pointer p-1.5 rounded-lg hover:bg-indigo-50 md:opacity-0 md:group-hover:opacity-100"
                                            title="Edit category"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoryList;