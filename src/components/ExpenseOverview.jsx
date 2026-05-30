import { useEffect, useState } from "react";
import {Plus} from "lucide-react";
import CustomLineChart from "./CustomLineChart.jsx";
import {prepareIncomeLineChartData} from "../util/util.js";

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);
        return () => {};
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100/50 pb-5">
                <div>
                    <h5 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Expense Trends</h5>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                        Track your spending trends over time and gain insights into where your money goes.
                    </p>
                </div>

                <button 
                    className="add-btn self-start sm:self-auto cursor-pointer" 
                    onClick={onExpenseIncome}
                >
                    <Plus size={15} />
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="mt-6">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default ExpenseOverview;
