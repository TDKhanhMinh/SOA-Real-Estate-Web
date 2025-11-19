import { formatCurrency } from "../utils/formatCurrency";

export const SummaryCard = ({ title, value, icon: Icon, color, bgColor, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h2 className="text-2xl font-extrabold text-gray-800">{value}</h2>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>
                <p className="text-sm text-green-600 font-semibold">
                    Doanh thu: {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                <p className="text-sm font-bold text-gray-800">{data.subscriptionName}</p>
                <p className="text-sm text-blue-600">
                    Số lượng: <span className="font-bold">{data.userCount}</span>
                </p>
            </div>
        );
    }
    return null;
};
export const FeatureItem = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-gray-600 text-sm font-medium">{label}</span>
        </div>
        <span className={`text-sm font-bold ${highlight ? 'text-blue-700' : 'text-gray-800'}`}>
            {value}
        </span>
    </div>
);
export const CustomRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const orders = payload.find(p => p.dataKey === 'totalOrders');
        const revenue = payload.find(p => p.dataKey === 'totalRevenue');

        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg space-y-1">
                <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>
                <p className="text-sm text-green-600 font-semibold flex justify-between gap-4">
                    <span>Doanh thu:</span> 
                    <span className="font-bold">{formatCurrency(revenue ? revenue.value : 0)}</span>
                </p>
                <p className="text-sm text-blue-600 font-semibold flex justify-between gap-4">
                    <span>Đơn hàng:</span> 
                    <span className="font-bold">{orders ? orders.value : 0}</span>
                </p>
            </div>
        );
    }
    return null;
};