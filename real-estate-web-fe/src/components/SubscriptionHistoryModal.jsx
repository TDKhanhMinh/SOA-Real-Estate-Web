import React, { useEffect, useState } from 'react';
import {
    History,
    BookOpen,
    Star,
    Calendar,
    X,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { formatDateTime } from '../utils/formatDateTime';
import { formatCurrency } from '../utils/formatCurrency';
import { Modal } from './Modal';


const formatStatus = (status) => {
    switch (status) {
        case 'COMPLETED':
            return (
                <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
                    <CheckCircle2 className="w-3 h-3" /> Thành công
                </span>
            );
        case 'PENDING':
            return (
                <span className="flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200">
                    <Clock className="w-3 h-3" /> Đang xử lý
                </span>
            );
        case 'FAILED':
            return (
                <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200">
                    <AlertCircle className="w-3 h-3" /> Thất bại
                </span>
            );
        default:
            return <span className="text-gray-600 text-xs">{status}</span>;
    }
};

export function SubscriptionHistoryModal({ userId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchSubscriptionHistory();
        }
    }, [isOpen]);

    const fetchSubscriptionHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            setHistory(await subscriptionService.getUserSubscriptionsHistoryByAdmin(userId));
            console.log("subs data", await subscriptionService.getUserSubscriptionsHistoryByAdmin(userId));

        } catch (err) {
            console.error("Failed to fetch subscription history:", err);
            setError("Không thể tải lịch sử mua gói. Vui lòng thử lại.");
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
                    <button onClick={fetchSubscriptionHistory} className="mt-2 text-sm text-blue-600 hover:underline">Thử lại</button>
                </div>
            );
        }

        if (!history || history.content?.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <BookOpen className="w-12 h-12 mb-3 opacity-30" />
                    <p>Chưa có lịch sử mua gói dịch vụ nào.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {history.content?.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                        >

                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                                        <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-800 text-base md:text-lg leading-tight">
                                            {item.subscriptionName || "Gói dịch vụ"}
                                        </h5>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                                                #{item.id}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" /> Thanh toán Online
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className="text-lg font-extrabold text-blue-600">
                                        {formatCurrency(item.amount)}
                                    </div>
                                    <div>{formatStatus(item.status)}</div>
                                </div>
                            </div>


                            <div className="border-t border-dashed border-gray-200 my-1"></div>


                            <div className="flex items-center justify-between text-sm bg-gray-50/80 rounded-lg p-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Ngày đăng ký</span>
                                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDateTime(item.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group text-left"
            >
                <History className="text-2xl text-green-600" />
                <span className="text-lg">Lịch sử gói thành viên</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Lịch sử gói thành viên"
            >
                <div className="flex flex-col gap-4">

                    {history && history?.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between text-sm text-blue-900 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-blue-400 text-xs uppercase font-bold tracking-wider">Tổng số lần mua</span>
                                <span className="text-xl font-bold">{history.length}</span>
                            </div>
                            <div className="h-8 w-px bg-blue-200 mx-4"></div>
                            <div className="flex flex-col items-end">
                                <span className="text-blue-400 text-xs uppercase font-bold tracking-wider">Tổng chi tiêu</span>
                                <span className="text-xl font-bold text-blue-700">
                                    {formatCurrency(history.reduce((acc, curr) =>
                                        curr.status === 'COMPLETED' ? acc + (curr.amount || 0) : acc, 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        {renderContent()}
                    </div>
                </div>
            </Modal>
        </>
    );
}