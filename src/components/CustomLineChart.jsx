import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import {addThousandsSeparator} from "../util/util.js";

const CustomLineChart = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;

            // Group items by category for the tooltip display
            const groupedItemsForTooltip = dataPoint.items.reduce((acc, item) => {
                const { categoryName, amount } = item;
                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        categoryName: categoryName,
                        totalAmount: 0,
                    };
                }
                acc[categoryName].totalAmount += amount;
                return acc;
            }, {});

            // Convert grouped object to array for mapping
            const categoriesInTooltip = Object.values(groupedItemsForTooltip);

            return (
                <div className="bg-white/95 backdrop-blur-md shadow-md rounded-2xl p-4 border border-white/60 animate-slide-up max-w-[240px]">
                    {/* Display the formatted date at the top of the tooltip */}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
                    
                    {/* Display the total amount for the date */}
                    <p className="text-sm text-gray-800 font-bold mb-2">
                        Total: <span className="text-base text-purple-700 ml-1 font-extrabold">&#8377;{addThousandsSeparator(dataPoint.totalAmount)}</span>
                    </p>

                    {/* Iterate over the newly grouped categories for a consolidated view */}
                    {categoriesInTooltip && categoriesInTooltip.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Details:</p>
                            {categoriesInTooltip.map((groupedItem, index) => (
                                <div key={index} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium">{groupedItem.categoryName}:</span>
                                    <span className="text-gray-800 font-bold">&#8377;{addThousandsSeparator(groupedItem.totalAmount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const formatYAxisTick = (value) => {
        if (value >= 1e9) {
            return `₹${(value / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
        }
        if (value >= 1e6) {
            return `₹${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
        }
        if (value >= 1e3) {
            return `₹${(value / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
        }
        return `₹${value}`;
    };

    return (
        <div className="w-full bg-transparent mt-2">
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                    <defs>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="rgba(229, 231, 235, 0.4)" strokeDasharray="4 4" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} 
                        stroke="none" 
                        dy={10}
                    />
                    <YAxis 
                        tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} 
                        stroke="none" 
                        dx={-8}
                        width={65}
                        tickFormatter={formatYAxisTick}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

                    <Area
                        type="monotone"
                        dataKey="totalAmount"
                        stroke="#8b5cf6"
                        fill="url(#expenseGradient)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#6d28d9", stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;