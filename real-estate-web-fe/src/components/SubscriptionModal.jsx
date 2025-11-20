import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionCard } from './SubscriptionCard';

export function SubscriptionModal({ userId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchSubscriptions();
        }
    }, [isOpen]);

    const fetchSubscriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await subscriptionService.getSubscriptionsByAdmin();
            const activePlans = res.filter(plan => plan.isActive);

            activePlans.sort((a, b) => a.priority - b.priority);
            setSubscriptions(activePlans);
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
            setError("Không thể tải danh sách gói. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={fetchSubscriptions} className="mt-2 text-sm text-blue-600 hover:underline">Thử lại</button>
                </div>
            );
        }

        const highestPriorityPlan = subscriptions.length > 0 ? subscriptions[0] : null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((plan, index) => (
                    <SubscriptionCard
                        userId={userId}
                        key={plan.id || index}
                        plan={plan}
                        isHighestPriority={highestPriorityPlan && plan.id === highestPriorityPlan.id}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-black hover:bg-blue-50/30 transition-all duration-200 group text-center"
            >
                <span className="text-xs px-2">Tặng gói thành viên</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Chọn Gói Thành Viên`}
                className={"max-w-6xl"}
            >
                <div className="p-4">
                    {renderContent()}
                </div>
            </Modal>
        </>
    );
}