import { useState, useEffect } from "react";

export default function Payments() {
    // Mock data
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

    const [userPayments, setUserPayments] = useState([
        {
            payment: {
                paymentId: 202,
                user: { fullName: "Trần Thị B" },
            },
            date: "2025-09-02 09:15",
            type: "Nạp tiền",
            paymentMethod: "Ngân hàng",
            amount: "500.000 VND",
            status: "Đang xử lý",
        },
    ]);

    const [notification, setNotification] = useState("Thao tác thành công!");

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <main className="flex-1 p-6">
            {/* Notification */}
            {notification && (
                <div className="fixed top-5 right-5 bg-green-100 text-green-700 border border-green-700 px-4 py-2 rounded shadow">
                    {notification}
                </div>
            )}

            {/* Nếu không có giao dịch */}
            {payments.length === 0 && userPayments.length === 0 ? (
                <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                    <div className="flex flex-col items-center">
                        <img
                            src="https://img.icons8.com/ios/100/000000/empty-box.png"
                            alt="empty"
                            className="mb-4"
                        />
                        <p className="text-gray-600 text-lg">Không có giao dịch nào</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Header */}
                    <div className="grid grid-cols-10 bg-white shadow p-4 font-bold">
                        <div>ID</div>
                        <div className="col-span-2 text-center">Người dùng</div>
                        <div className="text-center">Thời gian</div>
                        <div className="text-center">Phân loại</div>
                        <div className="col-span-2 text-center">Hình thức GD</div>
                        <div className="text-center">Khoảng tiền</div>
                        <div className="col-span-2 text-center">Trạng thái</div>
                    </div>

                    {/* Payments */}
                    {payments.map((p) => (
                        <div key={p.paymentId} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{p.paymentId}</div>
                                <div className="col-span-2 text-center">{p.user.fullName}</div>
                                <div className="text-center">{p.date}</div>
                                <div className="text-center">{p.type}</div>
                                <div className="col-span-2 text-center">{p.paymentMethod}</div>
                                <div className="text-center text-red-500">{p.amount}</div>
                                <div className="col-span-2 text-center">{p.status}</div>
                            </div>
                        </div>
                    ))}

                    {/* User Payments */}
                    {userPayments.map((u, i) => (
                        <div key={i} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{u.payment.paymentId}</div>
                                <div className="col-span-2 text-center">
                                    {u.payment.user.fullName}
                                </div>
                                <div className="text-center">{u.date}</div>
                                <div className="text-center">{u.type}</div>
                                <div className="col-span-2 text-center">{u.paymentMethod}</div>
                                <div className="text-center text-red-500">{u.amount}</div>
                                <div className="col-span-2 text-center">{u.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
