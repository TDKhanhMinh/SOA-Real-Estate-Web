import { BsPersonFill, BsClockHistory, BsWalletFill, BsX } from 'react-icons/bs';
import { InfoModal } from './InfoModal';
import { HistoryModal } from './HistoryModal';
import { BalanceModal } from './BalanceModal';

export const UserActionsModal = ({ isOpen, userId, onClose }) => {

    if (!isOpen) {
        return null;
    }
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        // Lớp phủ (Overlay)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
            onClick={handleOverlayClick}
        >


            <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300">


                <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Tài khoản
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
                        aria-label="Đóng modal"
                    >
                        <BsX />
                    </button>
                </div>


                <hr className="my-4" />


                <div className="flex flex-col gap-3">
                    <InfoModal userId={userId} />
                    <HistoryModal userId={userId} />
                    <BalanceModal userId={userId} />
                </div>
            </div>
        </div>
    );
};


