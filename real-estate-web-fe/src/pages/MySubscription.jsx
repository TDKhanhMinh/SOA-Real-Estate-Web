import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { transactionService } from '../services/transactionService';

import {
    BsInfoCircleFill,
    BsStars,
    BsGraphUp,
    BsShieldCheck,
    BsArrowRight,
    BsShieldFillCheck,
    BsClock,
    BsCalendarDate,
    BsCashCoin,
    BsBarChartFill,
    BsCalendarWeek,
    BsStarFill,
    BsClipboardData
} from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { formatDate } from './../utils/formatDate';
import { getDurationText } from './../utils/getDurationText';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from './../utils/formatDateTime';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const renderHistoryStatus = (status) => {
    let text = status;
    let className = '';
    switch (status) {
        case 'COMPLETED':
            text = 'Đã thanh toán';
            className = 'bg-green-100 text-green-700';
            break;
        case 'ACTIVE':
            text = 'Đang kích hoạt';
            className = 'bg-blue-100 text-blue-700';
            break;
        case 'EXPIRED':
            text = 'Đã hết hạn';
            className = 'bg-gray-100 text-gray-700';
            break;
        case 'FAILED':
            text = 'Thất bại';
            className = 'bg-red-100 text-red-700';
            break;
        default:
            className = 'bg-gray-100 text-gray-700';
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
            {text}
        </span>
    );
};

export default function MySubscription() {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [historyPage, setHistoryPage] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState(null);
    const [historyPageNum, setHistoryPageNum] = useState(0);
    const [historyPageSize] = useState(5);
    const [plans, setPlans] = useState([]);

    const renderSubscriptionName = (id) => {
        const subs = plans.find(subs => subs.id === id);
        console.log("sub buy", subs);
        return subs.name;
    }; useEffect(() => {
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
    const fetchMySubscription = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await subscriptionService.getUserSubscriptions();
            console.log("user subs", response);

            if (response) {
                setSubscription(response);
            } else {
                setSubscription(null);
            }
        } catch (err) {
            console.error("Lỗi khi tải gói hội viên:", err);
            if (err.response && err.response.status === 404) {
                setSubscription(null);
            } else {
                setError("Không thể tải thông tin. Vui lòng thử lại sau.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchSubscriptionHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);

        const params = {
            page: historyPageNum,
            size: historyPageSize,
            sort: 'purchasedAt,desc'
        };

        try {
            const response = await transactionService.getTransactionSubscription(params);
            console.info("subsss", response);
            setHistoryPage(response);
        } catch (err) {
            console.error("Lỗi khi tải lịch sử hội viên:", err);
            setHistoryError("Không thể tải lịch sử mua gói.");
        } finally {
            setHistoryLoading(false);
        }
    }, [historyPageNum, historyPageSize]);

    useEffect(() => {
        fetchMySubscription();
        fetchSubscriptionHistory();
    }, [fetchMySubscription, fetchSubscriptionHistory]);

    const handlerCancelSubscription = async () => {
        try {
            await subscriptionService.cancelSubscriptions();
            await fetchMySubscription();
            await fetchSubscriptionHistory();
            toast.success("Hủy gói hiện tại thành công và chuyển về gói thấp nhất");
        } catch (error) {
            toast.error(error)
        }

    }
    const goToNextHistoryPage = () => {
        if (historyPage && !historyPage.last) {
            setHistoryPageNum(prevPage => prevPage + 1);
        }
    };

    const goToPrevHistoryPage = () => {
        if (historyPage && !historyPage.first) {
            setHistoryPageNum(prevPage => prevPage - 1);
        }
    };

    const renderLoading = () => (
        <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">Đang tải thông tin gói hội viên...</p>
        </div>
    );

    const renderError = () => (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-8 py-10 rounded-2xl text-center shadow-lg">
            <div className="bg-white rounded-full p-5 w-24 h-24 mx-auto mb-6 shadow-lg">

                <FaTimes className="text-5xl text-red-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Đã xảy ra lỗi</h3>
            <p className="text-lg">{error}</p>
            <button
                onClick={fetchMySubscription}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Thử lại
            </button>
        </div>
    );

    const renderNoSubscription = () => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 px-8 py-12 rounded-2xl text-center shadow-xl">
            <div className="bg-white rounded-full p-5 w-24 h-24 mx-auto mb-6 shadow-lg">

                <BsInfoCircleFill className="text-5xl text-blue-500 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-800">Bạn chưa có gói hội viên</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Hãy nâng cấp tài khoản để trải nghiệm đầy đủ các tính năng cao cấp và tối ưu hiệu quả công việc!
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-xl shadow-md">

                    <BsStars className="text-3xl text-blue-500 mx-auto" />
                    <p className="text-sm font-medium text-gray-700 mt-2">Tính năng cao cấp</p>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-xl shadow-md">

                    <BsGraphUp className="text-3xl text-green-500 mx-auto" />
                    <p className="text-sm font-medium text-gray-700 mt-2">Hiệu quả tối ưu</p>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-xl shadow-md">

                    <BsShieldCheck className="text-3xl text-indigo-500 mx-auto" />
                    <p className="text-sm font-medium text-gray-700 mt-2">Ưu tiên hỗ trợ</p>
                </div>
            </div>

            <button
                onClick={() => navigate("/account/membership")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1">
                Xem các gói hội viên

                <BsArrowRight className="text-xl" />
            </button>
        </div>
    );

    const calculateDaysRemaining = (expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const renderSubscriptionDetails = (sub) => {
        const details = sub.subscription || sub;
        const daysRemaining = calculateDaysRemaining(sub.expiresAt);
        const isExpiringSoon = daysRemaining <= 7;

        return (
            <div className="space-y-6">

                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full -ml-24 -mb-24"></div>

                        <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-3">

                                        <BsShieldFillCheck className="text-base" />
                                        ĐANG KÍCH HOẠT
                                    </div>
                                    <h3 className="text-4xl font-bold mb-2">{details.name}</h3>
                                    <p className="text-blue-100 text-lg">{details.description}</p>
                                </div>
                                {
                                    subscription.name === 'basic' &&
                                    <div>
                                        <button onClick={handlerCancelSubscription} className="inline-flex items-center gap-2 bg-red-500  px-4 py-1.5 rounded-full text-sm font-semibold mb-3 hover:bg-red-700">
                                            <X className="text-base" />
                                            Hủy gói
                                        </button>
                                    </div>
                                }
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mt-8">
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">

                                        <BsClock className="text-lg" />
                                        <p className="text-sm font-medium text-blue-100">Ngày kích hoạt</p>
                                    </div>
                                    <p className="text-xl font-bold">{formatDateTime(sub.startDate)}</p>
                                </div>

                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">

                                        <BsCalendarDate className="text-lg" />
                                        <p className="text-sm font-medium text-blue-100">Ngày hết hạn</p>
                                    </div>
                                    <p className="text-xl font-bold">{formatDateTime(sub.endDate)}</p>
                                </div>

                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm font-medium text-blue-100">Còn lại</p>
                                    </div>
                                    <p className="text-xl font-bold">
                                        {daysRemaining || (details.duration)} ngày
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isExpiringSoon && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 rounded-full p-3">

                                <BsInfoCircleFill className="text-xl text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-blue-900 mb-2">Gói hội viên sắp hết hạn!</h4>
                                <p className="text-blue-800 mb-4">Gói của bạn sẽ hết hạn trong {daysRemaining} ngày. Gia hạn ngay để tiếp tục sử dụng các tính năng cao cấp.</p>
                                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Gia hạn ngay
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                        <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                            Chi tiết quyền lợi
                        </h4>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-6">

                            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">

                                        <BsCashCoin className="text-2xl text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700 mb-1">Giá gói</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {formatCurrency(details.price)}
                                            <span className="text-sm font-normal text-blue-600 ml-1">
                                                {getDurationText(details.duration)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">

                                        <BsBarChartFill className="text-2xl text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700 mb-1">Số tin đăng tối đa</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {details.maxPost} <span className="text-sm font-normal">tin</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">

                                        <BsCalendarWeek className="text-2xl text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700 mb-1">Thời hạn mỗi tin</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {details.postExpiryDays} <span className="text-sm font-normal">ngày</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">

                                        <BsStarFill className="text-2xl text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-700 mb-1">Độ ưu tiên</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            Mức {details.priority}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">Số càng nhỏ, ưu tiên càng cao</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Cần hỗ trợ? <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">Liên hệ ngay</a>
                            </div>
                            <button onClick={() => navigate("/account/membership")} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Nâng cấp gói

                                <BsArrowRight className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHistoryContent = () => {
        if (historyLoading) {
            return (
                <div className="p-8 text-center text-gray-500">
                    Đang tải lịch sử...
                </div>
            );
        }

        if (historyError) {
            return (
                <div className="p-8 text-center text-red-500 bg-red-50">
                    <strong>Lỗi:</strong> {historyError}
                </div>
            );
        }

        if (!historyPage || historyPage.content.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500">
                    Bạn chưa có lịch sử mua gói nào.
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên gói</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày mua</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hết hạn</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {historyPage.content.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {item ? renderSubscriptionName(item.id) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDateTime(item.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(item.expiresAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                    {item ? formatCurrency(item.amount) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {renderHistoryStatus(item.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans w-full">
            <div className="w-full mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                        Gói Hội Viên Của Bạn
                    </h1>
                    <p className="text-gray-600 text-lg">Quản lý và theo dõi gói hội viên hiện tại</p>
                </div>


                {isLoading && (
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8">
                        {renderLoading()}
                    </div>
                )}

                {error && (
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8">
                        {renderError()}
                    </div>
                )}

                {!isLoading && !error && (
                    subscription ? renderSubscriptionDetails(subscription) : (
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-8">
                            {renderNoSubscription()}
                        </div>
                    )
                )}

                <div className="mt-12">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

                            <BsClipboardData className="text-3xl text-gray-700" />
                            Lịch sử Mua Gói
                        </h2>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        {renderHistoryContent()}
                    </div>

                    {historyPage && historyPage.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <div>
                                <span className="text-sm text-gray-700">
                                    Trang <strong>{historyPage.number + 1}</strong> / <strong>{historyPage.totalPages}</strong>
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={goToPrevHistoryPage}
                                    disabled={historyPage.first || historyLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Trang trước
                                </button>
                                <button
                                    onClick={goToNextHistoryPage}
                                    disabled={historyPage.last || historyLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}