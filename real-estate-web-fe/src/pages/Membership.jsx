import { useState, useEffect } from 'react';
import { HiCheck, HiSparkles, HiClock, HiTrendingUp } from 'react-icons/hi';
import { subscriptionService } from '../services/subscriptionService';
import { formatCurrency } from '../utils/formatCurrency';
import { SubscriptionDetailModal } from '../components/SubscriptionDetailModal';
import { toast } from 'react-toastify';
import { getDurationText } from './../utils/getDurationText';



export default function Membership() {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null)

    const handleBuySubscription = async () => {
        try {
            await subscriptionService.buySubscriptions(selectedSubscription.id);
            setShowModal(false)
            toast.success("Bạn đã đặt mua gói hội viên thành công")
        } catch (error) {
            toast.error(error)

        }
    }
    useEffect(() => {
        fetchSubscriptions();
    }, []);
    const fetchSubscriptions = async () => {
        try {
            const res = await subscriptionService.getSubscriptionsByUser();
            const activePlans = res.filter(plan => plan.isActive);
            setPlans(activePlans);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        }
    };
    const benefits = [
        { icon: <HiSparkles className="w-5 h-5" />, text: "Thoải mái đăng tin/đẩy tin không lo biến động giá" },
        { icon: <HiTrendingUp className="w-5 h-5" />, text: "Quản lý ngân sách dễ dàng và hiệu quả" },
        { icon: <HiClock className="w-5 h-5" />, text: "Sử dụng các tính năng tiện ích nâng cao dành cho Hội viên" }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white rounded-b-3xl shadow-xl">
                <div className="absolute inset-0 bg-black opacity-5 rounded-b-3xl"></div>
                <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="text-center md:text-left">
                        <div className="inline-block mb-4">
                            <span className="bg-yellow-400 text-red-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                Ưu đãi đặc biệt
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Gói Hội viên
                        </h1>

                        <p className="text-2xl md:text-3xl font-semibold text-red-100 mb-8">
                            Tiết kiệm đến <span className="text-yellow-300 text-3xl md:text-4xl">39%</span> chi phí so với đăng tin/đẩy tin lẻ
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300"
                                >
                                    <div className="text-yellow-300 mt-0.5">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-sm leading-relaxed">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-red-200 bg-red-900 bg-opacity-30 inline-block px-4 py-2 rounded-lg">
                            Giá các gói bên dưới đã bao gồm 8% VAT
                        </p>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${plan.name === "Premium"
                                ? "ring-2 ring-yellow-400 transform md:scale-105"
                                : "hover:transform hover:scale-105"
                                }`}
                        >

                            {plan.name === "Premium" && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-center py-2 shadow-md z-10">
                                    <span className="text-red-900 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1">
                                        <HiSparkles className="w-4 h-4" />
                                        Bán chạy nhất
                                    </span>
                                </div>
                            )}

                            <div className={`p-6 ${plan.name === "Premium" ? "pt-12" : "pt-6"}`}>

                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem]">
                                        {plan.description}
                                    </p>
                                </div>


                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-red-600">
                                            {formatCurrency(plan.price)}
                                        </span>
                                        <span className="text-lg text-gray-500">₫</span>
                                        <span className="text-gray-500 text-sm font-medium">
                                            {getDurationText(plan.duration)}
                                        </span>
                                    </div>
                                </div>


                                <button
                                    onClick={() => {
                                        setSelectedSubscription(plan)
                                        setShowModal(true)
                                    }}
                                    className={`w-full font-semibold py-3.5 rounded-xl transition-all duration-300 mb-6 ${plan.name === "Premium"
                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        : "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
                                        }`}
                                >
                                    Mua ngay
                                </button>


                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                                        Chi tiết gói
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span><strong className="font-semibold">{plan.maxPost}</strong> tin đăng</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Tin tồn tại <strong className="font-semibold">{plan.postExpiryDays} ngày</strong></span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-gray-700">
                                            <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Độ ưu tiên: <strong className="font-semibold">{plan.priority}</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>


                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-200 transition-all duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
                <SubscriptionDetailModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onBuy={handleBuySubscription}
                    data={selectedSubscription}
                />

                <div className="text-center mt-12 mb-8">
                    <p className="text-gray-600 text-sm">
                        Cần tư vấn thêm? <a href="#" className="text-red-600 font-semibold hover:text-red-700 underline">Liên hệ với chúng tôi</a>
                    </p>
                </div>
            </div>
        </div>
    );
}