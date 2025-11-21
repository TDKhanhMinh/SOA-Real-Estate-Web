import {
    Clock,
    BarChart3,
    Crown,
    Timer,
} from 'lucide-react';
import { RiVipCrown2Line } from "react-icons/ri";
import { formatCurrency } from '../utils/formatCurrency';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'react-toastify';
export const SubscriptionCard = ({ plan, isHighestPriority, userId }) => {
    const getColor = (priority) => {
        if (priority <= 3) return 'purple';
        if (priority <= 5) return 'blue';
        return 'gray';
    };
    const handlerChooseSubscription = async (subId) => {
        try {
            await subscriptionService.donateSubscriptions(Number(userId), Number(subId));
            toast.success("Tặng gói thành viên thành công");
        } catch (error) {
            toast.error(error)
            console.log(error);
        }
    }

    const color = getColor(plan.priority);

    return (
        <div
            className={`relative flex flex-col rounded-xl border-2 ${isHighestPriority ? 'border-purple-600 shadow-xl' : 'border-gray-200'} bg-white p-6 transition-all duration-300 hover:shadow-lg`}
        >
            {isHighestPriority && (
                <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                    <RiVipCrown2Line className="w-4 h-4" /> Nổi bật
                </div>
            )}

            <h5 className="font-extrabold text-2xl text-gray-900 leading-tight mb-1 flex items-center gap-2">
                {plan.name}
            </h5>
            <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

            <div className="flex items-baseline mb-4 border-b pb-4">
                <span className="text-4xl font-extrabold text-blue-600">
                    {plan.price === 0 ? "Miễn phí" : formatCurrency(plan.price)}
                </span>
                {plan.price > 0 && <span className="ml-1 text-gray-500">/ {plan.duration === 30 ? "tháng" : "năm"}</span>}
            </div>

            <ul className="space-y-3 flex-1">
                <li className="flex items-center gap-3">
                    <BarChart3 className={`w-4 h-4 text-${color}-500`} />
                    <span className="text-sm">Đăng tối đa: <strong className="text-gray-800">{plan.maxPost}</strong> bài</span>
                </li>

                <li className="flex items-center gap-3">
                    <Crown className={`w-4 h-4 text-${color}-500`} />
                    <span className="text-sm">Độ ưu tiên hiển thị: <strong className="text-gray-800">{plan.priority}</strong></span>
                </li>

                <li className="flex items-center gap-3">
                    <Timer className={`w-4 h-4 text-${color}-500`} />
                    <span className="text-sm">Thời gian hiển thị tin: <strong className="text-gray-800">{plan.postExpiryDays} ngày</strong></span>
                </li>

                <li className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 text-${color}-500`} />
                    <span className="text-sm">Thời hạn gói: <strong className="text-gray-800">{plan.duration === 36500 ? "Vĩnh viễn" : `${plan.duration} ngày`}</strong></span>
                </li>

            </ul>

            <button
                onClick={() => handlerChooseSubscription(plan.id)}
                className={`mt-6 w-full py-3 rounded-xl text-white font-bold transition-all duration-200 ${isHighestPriority ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                Chọn gói này
            </button>
        </div>
    );
}