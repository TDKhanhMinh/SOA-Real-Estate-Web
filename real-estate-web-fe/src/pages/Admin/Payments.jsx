import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../../services/transactionService";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import { subscriptionService } from "../../services/subscriptionService";

const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);

export default function Payments() {
    const [activeTab, setActiveTab] = useState('transactions');

    const [notification, setNotification] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [transactionsPage, setTransactionsPage] = useState(null);
    const [subscriptionPage, setSubscriptionPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const params = {
            page: page,
            size: size,
            sort: 'createdAt,desc',
            search: filters.search || null,
            status: filters.status || null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
        };

        try {
            const [apiResponse, apiSubsResponse] = await Promise.all([
                transactionService.getTransactionByAdmin(params),
                subscriptionService.getSubscriptionsPaymentHistory(params)
            ]);

            setTransactionsPage(apiResponse);
            setSubscriptionPage(apiSubsResponse);
        } catch (err) {
            console.error('Lỗi khi fetch dữ liệu:', err);
            setError(err.message || 'Không thể tải dữ liệu.');
            setNotification('Lỗi: ' + (err.message || 'Lỗi hệ thống'));
        } finally {
            setIsLoading(false);
        }
    }, [page, size, filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    const currentPageData = activeTab === 'transactions' ? transactionsPage : subscriptionPage;

    const goToNextPage = () => {
        if (currentPageData && !currentPageData.last) {
            setPage(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPageData && !currentPageData.first) {
            setPage(prev => prev - 1);
        }
    };

    const getStatusBadge = (status) => {
        const s = status ? status.toUpperCase() : '';
        if (s === 'SUCCESS' || s === 'COMPLETED' || s === 'PAID')
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Thành công</span>;
        if (s === 'PENDING' || s === 'PROCESSING')
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Đang xử lý</span>;
        if (s === 'FAILED' || s === 'CANCELLED')
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Thất bại</span>;
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    };

    return (
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lịch sử thanh toán</h1>
                <p className="text-gray-500 text-sm mt-1">Quản lý các giao dịch nạp tiền và đăng ký gói dịch vụ</p>
            </div>

            {notification && (
                <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 z-50 flex items-center gap-2 ${error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                    <span className="text-sm font-medium">{notification}</span>
                </div>
            )}

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            name="search"
                            placeholder="Tìm user, mã GD..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon />
                        </div>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon />
                        </div>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-4">
                <button
                    onClick={() => { setActiveTab('transactions'); setPage(0); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'transactions'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Giao dịch nạp tiền
                </button>
                <button
                    onClick={() => { setActiveTab('subscriptions'); setPage(0); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'subscriptions'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Đăng ký gói
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500 text-sm">Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (!currentPageData || currentPageData.content.length === 0) ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="text-gray-300 mb-3">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                        <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc quay lại sau.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Người dùng / Email</th>
                                    <th className="px-6 py-3">Thời gian</th>
                                    <th className="px-6 py-3">Nội dung</th>
                                    <th className="px-6 py-3">Phương thức</th>
                                    <th className="px-6 py-3 text-right">Số tiền</th>
                                    <th className="px-6 py-3 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'transactions' && currentPageData.content.map((tx) => (
                                    <tr key={tx.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{tx.userName || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{formatDateTime(tx.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {tx.type || 'Nạp tiền'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{tx.paymentMethod || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-700">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(tx.status)}
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === 'subscriptions' && currentPageData.content.map((tx) => (
                                    <tr key={tx.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600">{tx.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{formatDateTime(tx.updatedAt)}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {tx.subscriptionName || 'Gói dịch vụ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{tx.paymentMethod || 'Online'}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-700">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(tx.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {currentPageData && currentPageData.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button onClick={goToPrevPage} disabled={currentPageData.first} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Trước</button>
                            <button onClick={goToNextPage} disabled={currentPageData.last} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Sau</button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Đang xem trang <span className="font-medium">{currentPageData.number + 1}</span> trên <span className="font-medium">{currentPageData.totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPageData.first}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPageData.last}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}