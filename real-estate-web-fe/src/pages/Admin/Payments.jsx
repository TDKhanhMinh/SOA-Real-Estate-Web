import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../../services/transactionService";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatCurrency } from "../../utils/formatCurrency";
import { subscriptionService } from "../../services/subscriptionService";

export default function Payments() {

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

            const apiResponse = await transactionService.getTransactionByAdmin(params);
            const apiSubsResponse = await subscriptionService.getSubscriptionsPaymentHistory(params);
            console.log("Trans", apiResponse);
            console.log("Subs his", apiSubsResponse);
            setTransactionsPage(apiResponse);
            setSubscriptionPage(apiSubsResponse);
        } catch (err) {
            console.error('Lỗi khi fetch giao dịch:', err);
            setError(err.message || 'Lỗi hệ thống, không thể tải dữ liệu nạp tiền.');
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
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
        setPage(0);
    };

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

    const noTransactions =
        (!transactionsPage || transactionsPage.content.length === 0);

    return (
        <main className="flex-1 p-6">
            {notification && (
                <div className={`fixed top-5 right-5 border px-4 py-2 rounded shadow ${error ? 'bg-red-100 text-red-700 border-red-700'
                    : 'bg-green-100 text-green-700 border-green-700'
                    }`}>
                    {notification}
                </div>
            )}

            <div className="filters bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Tìm theo user, mã GD..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                />

                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                />
            </div>

            {isLoading && <div className="text-center p-4">Đang tải dữ liệu nạp tiền...</div>}
            {error && !isLoading && <div className="text-center p-4 text-red-500">Lỗi: {error}</div>}

            {noTransactions && !isLoading ? (
                <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                    <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                        <div className="text-center text-gray-500">
                            <h3 className="text-xl font-semibold text-gray-700">Không có giao dịch nào</h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-10 bg-white shadow p-4 font-bold">
                        <div>ID</div>
                        <div className="col-span-2 text-center">Người dùng</div>
                        <div className="text-center">Thời gian</div>
                        <div className="text-center">Phân loại</div>
                        <div className="col-span-2 text-center">Hình thức GD</div>
                        <div className="text-center">Khoảng tiền</div>
                        <div className="col-span-2 text-center">Trạng thái</div>
                    </div>



                    {transactionsPage && transactionsPage.content.map((tx) => (
                        <div key={tx.id} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{tx.id}</div>
                                <div className="col-span-2 text-center">
                                    {tx.userName ? tx.userName : 'N/A'}
                                </div>
                                <div className="text-center">
                                    {formatDateTime(tx.createdAt)}
                                </div>
                                <div className="text-center">
                                    {tx.type || 'Nạp tiền'}
                                </div>
                                <div className="col-span-2 text-center">
                                    {tx.paymentMethod || 'N/A'}
                                </div>
                                <div className="text-center text-red-500">
                                    {formatCurrency(tx.amount)}
                                </div>
                                <div className="col-span-2 text-center">{tx.status}</div>
                            </div>
                        </div>
                    ))}
                    {subscriptionPage && subscriptionPage.content.map((tx) => (
                        <div key={tx.id} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{tx.id}</div>
                                <div className="col-span-2 text-center">
                                    {tx.email ? tx.email : 'N/A'}
                                </div>
                                <div className="text-center">
                                    {formatDateTime(tx.updatedAt)}
                                </div>
                                <div className="text-center">
                                    {tx.subscriptionName || 'Nạp tiền'}
                                </div>
                                <div className="col-span-2 text-center">
                                    {tx.paymentMethod || 'Online'}
                                </div>
                                <div className="text-center text-red-500">
                                    {formatCurrency(tx.amount)}
                                </div>
                                <div className="col-span-2 text-center">{tx.status}</div>
                            </div>
                        </div>
                    ))}

                    {transactionsPage && transactionsPage.totalPages > 1 && (
                        <div className="pagination flex justify-center items-center gap-4 mt-4 p-4 bg-white rounded shadow">
                            <button
                                onClick={goToPrevPage}
                                disabled={transactionsPage.first}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Trang trước
                            </button>
                            <span>
                                Trang {transactionsPage.number + 1} / {transactionsPage.totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={transactionsPage.last}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}