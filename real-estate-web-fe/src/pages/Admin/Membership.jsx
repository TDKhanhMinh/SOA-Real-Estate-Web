import { useEffect, useState } from "react";
import { HiMiniPlus, HiMiniPencil, HiMiniTrash } from "react-icons/hi2";
import { formatCurrency } from './../../utils/formatCurrency';
import { SubscriptionFormModal } from "../../components/SubscriptionFormModal";
import { subscriptionService } from "../../services/subscriptionService";



const mockSubscriptions = [
    {
        id: '1',
        name: 'Gói Cơ Bản',
        price: 9.99,
        duration: 30,
        description: 'Gói cơ bản cho người mới bắt đầu.',
        maxPost: 5,
        priority: 10,
        postExpiryDays: 15,
    },
    {
        id: '2',
        name: 'Gói VIP',
        price: 29.99,
        duration: 30,
        description: 'Gói VIP với nhiều ưu đãi và độ ưu tiên cao nhất.',
        maxPost: 50,
        priority: 1,
        postExpiryDays: 30,
    },
];
export default function MembershipManagement() {
    const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
    const [showModal, setShowModal] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    useEffect(() => {
        const fetchSubscriptions = async () => {
            const subscriptions = await subscriptionService.getSubscriptionsByAdmin();
            console.log("Subs", subscriptions);

        };
        fetchSubscriptions();
    }, [])

    /**
     * Mở modal để thêm mới
     */
    const handleAddNew = () => {
        setEditingSubscription(null);
        setShowModal(true);
    };

    /**
     * Mở modal để chỉnh sửa
     * @param {object} sub - Gói subscription cần sửa
     */
    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setShowModal(true);
    };

    /**
     * Xử lý xóa
     * @param {string} id - ID của gói cần xóa
     */
    const handleDelete = (id) => {
        // (Trong thực tế, bạn nên có một hộp thoại xác nhận)
        if (window.confirm('Bạn có chắc chắn muốn xóa gói này?')) {
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
        }
    };

    /**
     * Xử lý đóng modal
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSubscription(null);
    };

    /**
     * Xử lý submit từ form (Thêm mới hoặc Cập nhật)
     * @param {object} data - Dữ liệu từ form
     */
    const handleFormSubmit = (data) => {
        if (editingSubscription) {
            // Cập nhật
            setSubscriptions((prev) =>
                prev.map((sub) => (sub.id === editingSubscription.id ? { ...sub, ...data } : sub))
            );
        } else {
            // Thêm mới
            setSubscriptions((prev) => [
                ...prev,
                { ...data, id: Date.now().toString() }, // Tạo ID tạm thời
            ]);
        }
        handleCloseModal();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header trang */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Quản lý Gói Subscription
                    </h1>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        {/* THAY THẾ ICON TẠI ĐÂY */}
                        <HiMiniPlus className="h-5 w-5" />
                        Thêm gói mới
                    </button>
                </div>

                {/* Bảng dữ liệu */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Responsive wrapper cho bảng */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên gói
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời hạn (ngày)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số bài tối đa
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ưu tiên
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hạn bài đăng (ngày)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            Không có dữ liệu.
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{sub.name}</div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate" title={sub.description}>
                                                    {sub.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {/* <div>${sub.price.toFixed(2)}</div> */}
                                                <div className="text-sm text-green-700 font-medium">{formatCurrency(sub.price)}</div>
                                                <div className="text-xs text-gray-500">${sub.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {sub.duration}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {sub.maxPost}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {sub.priority}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {sub.postExpiryDays}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(sub)}
                                                        className="text-yellow-600 hover:text-yellow-800 transition-colors p-1"
                                                        title="Chỉnh sửa"
                                                    >
                                                        {/* THAY THẾ ICON TẠI ĐÂY */}
                                                        <HiMiniPencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                                                        title="Xóa"
                                                    >
                                                        {/* THAY THẾ ICON TẠI ĐÂY */}
                                                        <HiMiniTrash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal cho Form */}
            <SubscriptionFormModal
                show={showModal}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={editingSubscription}
            />
        </div>
    );
}