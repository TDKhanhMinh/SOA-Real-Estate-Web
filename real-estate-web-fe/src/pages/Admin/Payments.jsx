import { useState, useEffect, useCallback } from "react";
import { transactionService } from "../../services/transactionService";

export default function Payments() {
    const [payments, setPayments] = useState([
        {
            paymentId: 101,
            user: { fullName: "Nguyễn Văn A" },
            date: "2025-09-01 10:00",
            type: "Đăng bài",
            paymentMethod: "Momo",
            amount: "200.000 VND",
            status: "Thành công",
        },
    ]);
    const [notification, setNotification] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        status: '', // 'SUCCESS', 'PENDING', 'FAILED'
        startDate: '', // 'YYYY-MM-DD'
        endDate: '',   // 'YYYY-MM-DD'
    });
    const [page, setPage] = useState(0); // Trang hiện tại (backend tính từ 0)
    const [size] = useState(10); // Lấy 10 mục mỗi trang (bạn có thể thay đổi)

    const [transactionsPage, setTransactionsPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // 4. Hàm MỚI: Gọi API để lấy giao dịch NẠP TIỀN
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
            // Đây là endpoint API của bạn

            const apiResponse = await transactionService.getTransactionByAdmin({ params }); // ApiResponse<>
            console.log("Trans", apiResponse);

            setTransactionsPage(apiResponse)
        } catch (err) {
            console.error('Lỗi khi fetch giao dịch:', err);
            setError(err.message || 'Lỗi hệ thống, không thể tải dữ liệu nạp tiền.');
            setNotification('Lỗi: ' + (err.message || 'Lỗi hệ thống')); // Hiển thị lỗi trên UI
        } finally {
            setIsLoading(false);
        }
    }, [page, size, filters]);

    // 5. Effect MỚI: Tự động gọi API khi `page` hoặc `filters` thay đổi
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // 6. Hàm MỚI: Xử lý khi người dùng thay đổi filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
        setPage(0); // Reset về trang đầu tiên khi filter
    };

    // 7. Hàm MỚI: Xử lý phân trang
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

    // Biến kiểm tra rỗng (ĐÃ CẬP NHẬT)
    const noTransactions = payments.length === 0 &&
        (!transactionsPage || transactionsPage.content.length === 0);

    return (
        <main className="flex-1 p-6">
            {/* Notification (Giữ nguyên) */}
            {notification && (
                <div className={`fixed top-5 right-5 border px-4 py-2 rounded shadow ${error ? 'bg-red-100 text-red-700 border-red-700'
                    : 'bg-green-100 text-green-700 border-green-700'
                    }`}>
                    {notification}
                </div>
            )}

            {/* Bộ lọc cho Giao dịch NẠP TIỀN (MỚI) */}
            <div className="filters bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Tìm theo user, mã GD..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="SUCCESS">Thành công</option>
                    <option value="PENDING">Đang chờ</option>
                    <option value="FAILED">Thất bại</option>
                </select>
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

            {/* Trạng thái Loading và Error (MỚI) */}
            {isLoading && <div className="text-center p-4">Đang tải dữ liệu nạp tiền...</div>}
            {error && !isLoading && <div className="text-center p-4 text-red-500">Lỗi: {error}</div>}

            {/* Nếu không có giao dịch (ĐÃ CẬP NHẬT) */}
            {noTransactions && !isLoading ? (
                <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                    {/* ... (Phần "Không có giao dịch nào" giữ nguyên) ... */}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Header (Giữ nguyên) */}
                    <div className="grid grid-cols-10 bg-white shadow p-4 font-bold">
                        <div>ID</div>
                        <div className="col-span-2 text-center">Người dùng</div>
                        <div className="text-center">Thời gian</div>
                        <div className="text-center">Phân loại</div>
                        <div className="col-span-2 text-center">Hình thức GD</div>
                        <div className="text-center">Khoảng tiền</div>
                        <div className="col-span-2 text-center">Trạng thái</div>
                    </div>

                    {/* Payments (Đăng bài - Giữ nguyên) */}
                    {payments.map((p) => (
                        <div key={p.paymentId} className="bg-white shadow mt-2">
                            {/* ... (Render cho 'payments' giữ nguyên) ... */}
                        </div>
                    ))}

                    {/* User Payments (Nạp tiền - ĐÃ CẬP NHẬT từ API) */}
                    {transactionsPage && transactionsPage.content.map((tx) => (
                        // Giả định `tx` (Transaction) có cấu trúc:
                        // { id, user: { fullName }, createdAt, type, paymentMethod, amount, status }
                        // Bạn cần ĐIỀU CHỈNH các trường này cho đúng với object Transaction của bạn
                        <div key={tx.id} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{tx.id}</div>
                                <div className="col-span-2 text-center">
                                    {/* Giả sử user object có trong tx */}
                                    {tx.user ? tx.user.fullName : 'N/A'}
                                </div>
                                <div className="text-center">
                                    {/* Format lại ngày tháng nếu cần */}
                                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                                </div>
                                <div className="text-center">
                                    {tx.type || 'Nạp tiền'}
                                </div>
                                <div className="col-span-2 text-center">
                                    {tx.paymentMethod || 'N/A'}
                                </div>
                                <div className="text-center text-red-500">
                                    {/* Format tiền tệ nếu cần */}
                                    {tx.amount.toLocaleString('vi-VN')} VND
                                </div>
                                <div className="col-span-2 text-center">{tx.status}</div>
                            </div>
                        </div>
                    ))}

                    {/* Phân trang (MỚI) */}
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