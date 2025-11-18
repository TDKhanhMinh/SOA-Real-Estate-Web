import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3,
    Calendar,
    Users,
    TrendingUp,
    DollarSign,
    PieChart as PieChartIcon,
    RefreshCw,
    Filter
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from 'recharts';
import { formatDate } from './../../utils/formatDate';
import { formatCurrency } from './../../utils/formatCurrency';
import { subscriptionService } from '../../services/subscriptionService';
import { CustomPieTooltip, CustomRevenueTooltip, CustomTooltip, SummaryCard } from '../../components/Chart';
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


export default function Dashboard() {
    const [dateRange, setDateRange] = useState({
        startDate: formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
        endDate: formatDate(new Date())
    });

    const [revenueData, setRevenueData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const revenueRes = await subscriptionService.getUserSubscriptionsRevenue({ startDate: dateRange.startDate, endDate: dateRange.endDate });
            const userRes = await subscriptionService.getUserPerSubscriptions();
            console.log("revenue", revenueRes);
            console.log("user", userRes);

            setRevenueData(revenueRes);
            setUserData(userRes);

        } catch (err) {
            console.error("Error fetching stats:", err);
            setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const summary = useMemo(() => {
        const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
        const totalUsers = userData.reduce((acc, curr) => acc + curr.userCount, 0);
        const topPackage = userData.length > 0
            ? userData.reduce((prev, current) => (prev.userCount > current.userCount) ? prev : current)
            : { subscriptionName: 'N/A' };

        return { totalRevenue, totalUsers, topPackage };
    }, [revenueData, userData]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="text-blue-600" /> Thống kê & Báo cáo
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Tổng quan về doanh thu và tăng trưởng người dùng</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 px-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Lọc theo ngày:</span>
                    </div>
                    <input
                        type="date"
                        name="startDate"
                        value={dateRange.startDate}
                        onChange={handleDateChange}
                        className="text-sm border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none border"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        name="endDate"
                        value={dateRange.endDate}
                        onChange={handleDateChange}
                        className="text-sm border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none border"
                    />
                    <button
                        onClick={fetchData}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-2"
                        title="Làm mới dữ liệu"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>


            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm">
                    <p className="text-red-700">{error}</p>
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="Tổng Doanh Thu"
                    value={formatCurrency(summary.totalRevenue)}
                    icon={DollarSign}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    subtext="Trong khoảng thời gian đã chọn"
                />
                <SummaryCard
                    title="Tổng Người Dùng Gói"
                    value={summary.totalUsers}
                    icon={Users}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    subtext="Đang sử dụng dịch vụ"
                />
                <SummaryCard
                    title="Gói Phổ Biến Nhất"
                    value={summary.topPackage.subscriptionName}
                    icon={TrendingUp}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    subtext={`${summary.topPackage.userCount || 0} người dùng`}
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" /> Biểu đồ Doanh thu
                        </h3>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date" // ĐÃ ĐỔI TỪ 'period' SANG 'date'
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomRevenueTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="totalRevenue"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-blue-500" /> Phân bố Người dùng
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-6">Tỷ lệ người dùng theo từng gói dịch vụ</p>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="userCount"
                                    nameKey="subscriptionName"
                                >
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>


                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%] text-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-800">{summary.totalUsers}</span>
                            <p className="text-xs text-gray-400">Total Users</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Chi tiết dữ liệu doanh thu</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Thời gian</th>
                                <th className="px-6 py-3 text-right">Doanh thu</th>
                                <th className="px-6 py-3 text-right">Tăng trưởng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {revenueData.map((item, index) => {
                                const prev = revenueData[index - 1];
                                const growth = prev ? ((item.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100 : 0;

                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-700">{formatDate(item.date)}</td>
                                        <td className="px-6 py-3 text-right font-bold text-gray-900">
                                            {formatCurrency(item.totalRevenue)}
                                        </td>
                                        <td className={`px-6 py-3 text-right font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                                        </td>
                                    </tr>
                                );
                            })}
                            {revenueData.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


