import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { Coins, Wallet, WalletCards } from "lucide-react";
import { addThousandsSeparator } from "../util/util.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import RecentTransactions from "../components/RecentTransactions.jsx";
import FinanceOverview from "../components/FinanceOverview.jsx";
import Transactions from "../components/Transactions.jsx";

const Home = () => {
    useUser();
    const { user } = useContext(AppContext);

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
            if (response.status === 200) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Something went wrong while fetching dashboard data:', error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
        return () => { };
    }, []);

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-6 max-w-[1400px] mx-auto space-y-6">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/5 p-5 rounded-2xl shadow-sm backdrop-blur-md">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Overview Dashboard</h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                Welcome back, <span className="text-purple-600 dark:text-purple-400 font-semibold">{user?.fullName || "User"}</span>. Here is your financial snapshot.
                            </p>
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 select-none bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 self-start md:self-auto">
                            Last Updated: Just Now
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Display the cards */}
                        <InfoCard
                            icon={<WalletCards size={20} />}
                            label="Total Balance"
                            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                            color="bg-purple-800"
                        />
                        <InfoCard
                            icon={<Wallet size={20} />}
                            label="Total Income"
                            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                            color="bg-green-800"
                        />
                        <InfoCard
                            icon={<Coins size={20} />}
                            label="Total Expense"
                            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                            color="bg-red-800"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* finance overview chart */}
                        <FinanceOverview
                            totalBalance={dashboardData?.totalBalance || 0}
                            totalIncome={dashboardData?.totalIncome || 0}
                            totalExpense={dashboardData?.totalExpense || 0}
                        />

                        {/* Recent transactions */}
                        <RecentTransactions
                            transactions={dashboardData?.recentTransactions}
                            onMore={() => navigate("/expense")}
                        />

                        {/* Expense transactions */}
                        <Transactions
                            transactions={dashboardData?.recent5Expenses || []}
                            onMore={() => navigate("/expense")}
                            type="expense"
                            title="Recent Expenses"
                        />

                        {/* Income transactions */}
                        <Transactions
                            transactions={dashboardData?.recent5Incomes || []}
                            onMore={() => navigate("/income")}
                            type="income"
                            title="Recent Incomes"
                        />
                    </div>
                </div>
            </Dashboard>
        </div>
    )
}

export default Home;