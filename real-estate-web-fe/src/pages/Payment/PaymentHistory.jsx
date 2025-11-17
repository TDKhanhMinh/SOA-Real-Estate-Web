import React, { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../../services/transactionService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDateTime';


const renderStatus = (status) => {
    let text = status;
    let className = '';

    switch (status) {
        case 'COMPLETED':
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


export default function PaymentHistory() {
    const [transactionsPage, setTransactionsPage] = useState(null);

    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const params = {
            page: page,
            size: size,
            sort: 'createdAt,desc',
            status: null,
        };
        try {
            const response = await transactionService.getUserTransaction(params);
            console.log("transs", response);
            setTransactionsPage(response);
        } catch (err) {
            console.error("Lỗi khi tải lịch sử nạp tiền:", err);
            setError(err.message || 'Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);


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



            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {renderContent()}
            </div>

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