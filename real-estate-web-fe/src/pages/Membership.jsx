import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { subscriptionService } from '../services/subscriptionService';
// **THAY ĐỔI 1:** Import icon từ react-icons
import { HiCheck } from 'react-icons/hi';


// **THAY ĐỔI 2:** Xóa bỏ code SVG 'const CheckIcon = ...'


export default function Membership() {

    const [plans, setPlans] = useState([]);

    const getDurationText = (duration) => {
        if (duration > 36000) return "/năm";
        if (duration === 30) return "/tháng";
        return `/${duration} ngày`;
    };

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await subscriptionService.getSubscriptionsByUser();

                if (Array.isArray(res)) {
                    const activePlans = res.filter(plan => plan.isActive);
                    setPlans(activePlans);
                } else {
                    console.error("API response is not an array:", res);
                }

            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            }
        };
        fetchSubscriptions();
    }, []);



    return (
        <div className="bg-gray-50 min-h-screen">
            <div
                className="relative bg-gradient-to-b from-red-700 to-red-900 bg-center text-white rounded-b-2xl"
            >
                <div className=" bg-opacity-80 p-10 rounded-b-2xl">
                    <h1 className="text-3xl font-bold mb-4">Gói Hội viên</h1>
                    <p className="text-xl font-semibold text-red-200 mb-6">
                        Tiết kiệm đến <span className="text-white">39%</span> chi phí so với
                        đăng tin/đẩy tin lẻ
                    </p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            Thành thơi đăng tin/đẩy tin không lo biến động giá
                        </li>
                        <li className="flex items-center gap-2">
                            Quản lý ngân sách dễ dàng và hiệu quả
                        </li>
                        <li className="flex items-center gap-2">
                            Sử dụng các tính năng tiện ích nâng cao dành cho Hội viên
                        </li>
                    </ul>

                    <p className="mt-4 text-xs text-red-200">
                        Giá của các gói bên dưới chưa bao gồm 8% VAT.
                    </p>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 mt-4">
                <div className="bg-gray-50 min-h-screen py-10 px-6">
                    <div className="max-w-7xl mx-auto">


                        <div className="grid md:grid-cols-3 gap-6 ">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`transform transition duration-300 hover:scale-[1.03] bg-white border rounded-xl shadow-lg hover:shadow-2xl p-6 relative ${plan.name === "Premium" ? "ring-2 ring-yellow-400" : ""
                                        }`}
                                >
                                    {plan.name === "Premium" && (
                                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Bán chạy nhất
                                        </span>
                                    )}

                                    <h3 className="text-lg font-bold text-red-600 mb-1">
                                        {plan.name}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4 min-h-[4.5rem]">
                                        {plan.description}
                                    </p>

                                    <p className="text-xl font-bold">
                                        {formatCurrency(plan.price)}
                                        <span className="text-gray-500 text-sm font-normal ml-1">
                                            {getDurationText(plan.duration)}
                                        </span>
                                    </p>

                                    <div className="h-6 mb-4">
                                    </div>

                                    <button className={`w-full font-semibold py-2 rounded transition mb-4 ${plan.name === "Premium"
                                            ? "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
                                            : "bg-white border border-red-500 text-red-500 hover:bg-red-50"
                                        }`}>
                                        Mua ngay
                                    </button>

                                    <h4 className="font-semibold mb-2">Chi tiết gói</h4>
                                    <ul className="space-y-1 mb-4">

                                        {/* **THAY ĐỔI 3:** Sử dụng <HiCheck /> và truyền class vào */}
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-600" /> {plan.maxPost} tin đăng
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-600" /> Tin tồn tại {plan.postExpiryDays} ngày
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-600" /> Độ ưu tiên hiển thị: {plan.priority}
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}