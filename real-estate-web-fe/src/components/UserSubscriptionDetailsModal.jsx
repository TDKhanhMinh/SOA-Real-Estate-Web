import React, { useEffect, useState } from 'react';
import {
    Star,
    Calendar,
    X,
    CheckCircle2,
    Clock,
    BarChart3,
    Crown,
    Timer,
    Mail,
} from 'lucide-react';
import { RiVipCrown2Line } from "react-icons/ri";
import { formatDateTime } from '../utils/formatDateTime';
import { formatCurrency } from '../utils/formatCurrency';
import { Modal } from './Modal';
import { subscriptionService } from '../services/subscriptionService';


export function UserSubscriptionDetailsModal({ userId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [present, setPresent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchSubscriptionPresent();
        }
    }, [isOpen]);

    const fetchSubscriptionPresent = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("present data", await subscriptionService.getUserPresentSubscriptionsByUserId(userId));

            setPresent(await subscriptionService.getUserPresentSubscriptionsByUserId(userId));
        } catch (err) {
            console.error("Failed to fetch subscription Present:", err);
            setError("Không thể tải lịch sử mua gói. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderStatusBadge = (status) => {
        const s = status?.toUpperCase();
        if (s === 'ACTIVE') {
            return <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle2 className="w-3 h-3" /> Đang hoạt động</span>;
        }
        if (s === 'EXPIRED') {
            return <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold border border-gray-200"><Present className="w-3 h-3" /> Đã hết hạn</span>;
        }
        if (s === 'PENDING') {
            return <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"><Clock className="w-3 h-3" /> Chờ thanh toán</span>;
        }
        return <span className="text-xs font-bold">{status}</span>;
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
                    <button onClick={fetchSubscriptionPresent} className="mt-2 text-sm text-blue-600 hover:underline">Thử lại</button>
                </div>
            );
        }

        return (
            <div className="space-y-4">

                <div
                    className={`relative flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 
                                border-blue-200 shadow-md ring-1 ring-blue-100
                            `}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 p-2.5 rounded-xl shadow-sm bg-blue-600 text-white`}>
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-800 text-lg leading-tight">
                                    {present?.subscriptionName}
                                </h5>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                        <Mail className="w-3 h-3" /> {present?.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="text-right flex justify-between items-between gap-1">
                        <div className={`text-lg font-extrabold text-blue-600`}>
                           Giá {formatCurrency(present?.price)}
                        </div>
                        <div>{renderStatusBadge(present?.status)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3" /> {formatDateTime(present?.startDate)}</span>
                            <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> {formatDateTime(present?.endDate)}</span>
                        </div>
                    </div>


                    <div className="grid grid-cols-3 gap-2 mt-1">
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                            <BarChart3 className="w-4 h-4 text-blue-600 mb-1" />
                            <span className="text-lg font-bold text-gray-800 leading-none">{present?.maxPost}</span>
                            <span className="text-[10px] text-gray-500">Bài đăng</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-50/50 border border-purple-100">
                            <Crown className="w-4 h-4 text-purple-600 mb-1" />
                            <span className="text-lg font-bold text-gray-800 leading-none">{present?.priority}</span>
                            <span className="text-[10px] text-gray-500">Độ ưu tiên</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-orange-50/50 border border-orange-100">
                            <Timer className="w-4 h-4 text-orange-600 mb-1" />
                            <span className="text-lg font-bold text-gray-800 leading-none">{present?.postExpiryDays}</span>
                            <span className="text-[10px] text-gray-500">Ngày/tin</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group text-left"
            >
                <RiVipCrown2Line className="text-2xl text-yellow-600" />
                <span className="text-lg">Gói thành viên hiện tại</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Gói hiện tại`}
            >
                <div className="flex flex-col gap-4">

                    {present && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg flex justify-around items-center">
                            <div className="text-center">
                                <div className="text-white text-xs uppercase font-bold tracking-wider mb-1">Gói hiện tại</div>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {present?.subscriptionName}
                                </div>
                            </div>
                        </div>
                    )}

                    {renderContent()}
                </div>
            </Modal>
        </>
    );
}