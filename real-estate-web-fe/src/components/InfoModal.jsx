import React, { useEffect, useState } from 'react';
import {
    BsPersonFill,
    BsFillPersonVcardFill,
    BsCheckCircleFill,
    BsXCircleFill
} from 'react-icons/bs';
import { Modal } from './Modal';
import { userService } from '../services/userService';
import { formatDateTime } from '../utils/formatDateTime';

const formatRole = (role) => {
    switch (role) {
        case 'REALTOR':
            return 'Nhà môi giới';
        case 'ADMIN':
            return 'Quản trị viên';
        case 'USER':
            return 'Người dùng';
        default:
            return role;
    }
};



export const InfoModal = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId && !user) {
            fetchUser();
        }
    }, [isOpen, userId, user]);

    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.getUserById(userId);
            console.log("userr ", response);
            setUser(response);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setUser(null);
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Đang tải...</p>;
        }

        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        if (!user) {
            return <p className="text-center text-gray-500">Không có dữ liệu.</p>;
        }

        return (
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="h-24 w-24 flex-shrink-0 rounded-full border-2 border-blue-300 object-cover shadow-md"
                    />
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-blue-800">{user.name}</h4>
                        <p className="text-gray-600">{user.email}</p>
                        <div className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {user.isActive ? <BsCheckCircleFill /> : <BsXCircleFill />}
                            <span>{user.isActive ? 'Đang hoạt động' : 'Đã khóa'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 rounded-md border bg-gray-50 p-4">
                    <InfoRow label="Mã người dùng" value={`#${user.id}`} />
                    <InfoRow label="Số điện thoại" value={user.phone || 'Chưa cập nhật'} />
                    <InfoRow label="Vai trò" value={formatRole(user.role)} />
                    <InfoRow label="Ngày tham gia" value={formatDateTime(user.createdAt)} />
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg bg-white p-4 text-left font-medium text-gray-700 shadow-md transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500 focus:outline-none"
            >
                <BsPersonFill className="text-2xl text-blue-600" />
                <span className="text-lg">Thông tin người dùng</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Thông tin chi tiết người dùng"
            >
                {renderContent()}
            </Modal>
        </>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-wrap justify-between gap-x-2">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-right text-gray-800">{value}</span>
    </div>
);