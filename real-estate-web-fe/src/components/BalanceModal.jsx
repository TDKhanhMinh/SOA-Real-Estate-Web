import React, { useEffect, useState } from 'react';
import { BsWalletFill, BsBank } from 'react-icons/bs';
import { Modal } from './Modal';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/formatCurrency';


export const BalanceModal = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId && !wallet) {
            fetchUserWallet();
        }
    }, [isOpen, userId, wallet]);

    const fetchUserWallet = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await transactionService.getUserWalletByAdmin(userId);
            console.log("user wallet ", response);
            setWallet(response);
        } catch (err) {
            console.error("Failed to fetch wallet:", err);
            setError("Không thể tải số dư. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        return (
            <div className="flex h-16 items-center justify-center">
                {loading && (
                    <p className="text-lg text-gray-500">Đang tải số dư...</p>
                )}

                {error && (
                    <p className="text-lg font-semibold text-red-500">{error}</p>
                )}

                {wallet && !loading && (
                    <h2 className="text-5xl font-bold text-indigo-700">
                        {formatCurrency(wallet.balance)}
                    </h2>
                )}
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg bg-white p-4 text-left font-medium text-gray-700 shadow-md transition-all hover:shadow-lg hover:ring-2 hover:ring-indigo-500 focus:outline-none"
            >
                <BsWalletFill className="text-2xl text-indigo-600" />
                <span className="text-lg">Số dư tài khoản</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Số dư tài khoản"
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <BsBank className="text-5xl text-indigo-500" />
                    <p className="text-lg text-gray-600">Số dư khả dụng:</p>
                    {renderContent()}
                </div>
            </Modal>
        </>
    );
};