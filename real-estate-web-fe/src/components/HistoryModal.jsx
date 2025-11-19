import React, { useEffect, useState } from 'react';
import { BsClockHistory, BsCalendarEvent } from 'react-icons/bs';
import { Modal } from './Modal';
import { transactionService } from '../services/transactionService';
import { formatDateTime } from '../utils/formatDateTime';
import { formatCurrency } from '../utils/formatCurrency';


const formatTransactionType = (type) => {
    switch (type) {
        case 'TOP_UP':
            return 'Nạp tiền vào tài khoản';
        // Thêm các loại khác nếu có
        case 'PURCHASE_SUBSCRIPTION':
            return 'Thanh toán gói thành viên';
        default:
            return type;
    }
};

const formatStatus = (status) => {
    switch (status) {
        case 'COMPLETED':
            return 'Hoàn thành';
        case 'PENDING':
            return 'Đang chờ';
        case 'FAILED':
            return 'Thất bại';
        default:
            return status;
    }
};


export const HistoryModal = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId && !history) {
            fetchUserWallet();
        }
    }, [isOpen, userId, history]);

    const fetchUserWallet = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await transactionService.getUserTransactionHistoryByAdmin(userId);
            console.log("user history ", response);
            setHistory(response);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setHistory(null);
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-500">Đang tải...</p>;
        }

        if (error) {
            return <p className="text-red-500">{error}</p>;
        }

        if (!history || !history.content || history.content.length === 0) {
            return <p className="text-gray-500">Không có giao dịch nào.</p>;
        }

        return (
            <ul className="max-h-96 space-y-3 overflow-y-auto pr-2">
                {history.content.map((transaction) => (
                    <li
                        key={transaction.id}
                        className="flex justify-between items-start gap-3 rounded-md border bg-gray-50 p-3 shadow-sm"
                    >
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">
                                {formatTransactionType(transaction.transactionType)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatDateTime(transaction.createdAt)}
                            </p>
                            <p className="text-sm">
                                Trạng thái:
                                <span className={`ml-1 font-semibold ${transaction.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                    {formatStatus(transaction.status)}
                                </span>
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <p className={`text-lg font-bold ${transaction.transactionType === 'TOP_UP' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {transaction.transactionType === 'TOP_UP' ? '+' : ''}
                                {formatCurrency(transaction.amount)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg bg-white p-4 text-left font-medium text-gray-700 shadow-md transition-all hover:shadow-lg hover:ring-2 hover:ring-green-500 focus:outline-none"
            >
                <BsClockHistory className="text-2xl text-green-600" />
                <span className="text-lg">Lịch sử giao dịch</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Lịch sử giao dịch"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b pb-2">
                        <BsCalendarEvent className="text-3xl text-green-500" />
                        <h4 className="text-lg font-semibold">Danh sách giao dịch</h4>
                    </div>

                    {renderContent()}

                </div>
            </Modal>
        </>
    );
};