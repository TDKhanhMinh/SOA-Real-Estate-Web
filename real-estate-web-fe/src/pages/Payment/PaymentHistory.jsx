import React, { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../../services/transactionService';

/**
 * Endpoint API (Giả định)
 * Đây LÀ API CỦA USER, không phải của Admin.
 * Backend sẽ tự động lấy userId từ token (JWT)
 */
const API_URL = '/api/transactions/my-history';

// --- Helper Functions (Hàm hỗ trợ) ---

// Hàm định dạng tiền tệ (ví dụ: 1000000 -> "1.000.000 VND")
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        return amount;
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// Hàm định dạng ngày giờ (ví dụ: "2025-11-17T12:30:00" -> "17/11/2025, 12:30")
const formatDateTime = (isoString) => {
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(isoString));
    } catch (e) {
        return isoString;
    }
};

// Hàm hiển thị và tạo màu cho Trạng thái
const renderStatus = (status) => {
    let text = status;
    let className = '';

    switch (status) {
        case 'SUCCESS':
            text = 'Thành công';
            className = 'bg-green-100 text-green-700';
            break;
        case 'PENDING':
            text = 'Đang chờ';
            className = 'bg-yellow-100 text-yellow-700';
            break;
        case 'FAILED':
            text = 'Thất bại';
            className = 'bg-red-100 text-red-700';
            break;
        default:
            className = 'bg-gray-100 text-gray-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
            {text}
        </span>
    );
};

// --- Component Chính ---

export default function PaymentHistory() {
    const [transactionsPage, setTransactionsPage] = useState(null);

    // State cho phân trang và bộ lọc
    const [page, setPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
    const [size] = useState(10); // 10 mục mỗi trang
    const [statusFilter, setStatusFilter] = useState(''); // "" = Tất cả

    // State cho trạng thái UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hàm gọi API (dùng useCallback để tối ưu)
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const params = {
            page: page,
            size: size,
            sort: 'createdAt,desc', // Luôn ưu tiên mới nhất
            status: statusFilter || null, // Gửi null nếu filter là ""
        };

        try {
            // Giả định API này (của USER) trả về ApiResponse<Page<Transaction>>
            const response = await transactionService.getUserTransaction({ params });
            console.log("transs", response);

            setTransactionsPage(response.content); // data.data là Page object
        } catch (err) {
            console.error("Lỗi khi tải lịch sử nạp tiền:", err);
            setError(err.message || 'Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    }, [page, size, statusFilter]);

    // useEffect: Tự động gọi API khi page hoặc statusFilter thay đổi
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]); // dependency là hàm useCallback

    // --- Handlers ---

    // Xử lý khi người dùng đổi bộ lọc
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(0); // Reset về trang đầu tiên khi lọc
    };

    // Xử lý phân trang
    const goToNextPage = () => {
        if (transactionsPage && !transactionsPage.last) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (transactionsPage && !transactionsPage.first) {
            setPage(prevPage => prevPage - 1);
        }
    };

    // --- Render ---

    // Hàm render nội dung chính (loading, error, empty, or table)
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-10 text-gray-500">
                    Đang tải lịch sử giao dịch...
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">
                    <strong>Lỗi:</strong> {error}
                </div>
            );
        }

        if (!transactionsPage || transactionsPage.content?.length === 0) {
            return (
                <div className="text-center p-10 text-gray-500">

                    <p>Bạn chưa có giao dịch nạp tiền nào.</p>
                </div>
            );
        }

        // Nếu có dữ liệu
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã GD
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phương thức
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactionsPage.content?.map((tx) => (
                            // Giả định 'tx' (Transaction) có các trường:
                            // id, createdAt, amount, paymentMethod, status
                            <tr key={tx.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{tx.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDateTime(tx.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {formatCurrency(tx.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {tx.paymentMethod}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {renderStatus(tx.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 font-sans w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Lịch sử Nạp tiền
            </h1>

            {/* Bộ lọc */}
            <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Lọc theo trạng thái
                </label>
                <select
                    id="status"
                    name="status"
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Đang chờ</option>
                    <option value="SUCCESS">Thành công</option>
                    <option value="FAILED">Thất bại</option>
                </select>
            </div>

            {/* Bảng dữ liệu (hoặc loading/error/empty) */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {renderContent()}
            </div>

            {/* Phân trang */}
            {transactionsPage && transactionsPage.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <div>
                        <span className="text-sm text-gray-700">
                            Trang <strong>{transactionsPage.number + 1}</strong> / <strong>{transactionsPage.totalPages}</strong>
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={transactionsPage.first || isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trang trước
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={transactionsPage.last || isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}