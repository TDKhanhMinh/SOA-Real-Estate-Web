import { useEffect, useState } from "react";
import { HiMiniPlus, HiMiniPencil, HiMiniTrash } from "react-icons/hi2";
import { formatCurrency } from './../../utils/formatCurrency';
import { SubscriptionFormModal } from "../../components/SubscriptionFormModal";
import { subscriptionService } from "../../services/subscriptionService";
import { toast } from "react-toastify";


export default function MembershipManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);

    useEffect(() => {

        fetchSubscriptions();
    }, []);
    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await subscriptionService.getSubscriptionsByAdmin();


            if (response && Array.isArray(response)) {
                setSubscriptions(response);
            } else {
                console.warn("API response không đúng định dạng:", response);
                setSubscriptions([]);
            }

        } catch (err) {
            console.error("Lỗi khi tải subscriptions:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddNew = () => {
        setEditingSubscription(null);
        setShowModal(true);
    };


    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSubscription(null);
    };


    const handleFormSubmit = async (data) => {
        console.log("edit subs", editingSubscription);

        if (editingSubscription !== null) {
            console.log("edit ");

            try {
                const res = await subscriptionService.updateSubscriptions(editingSubscription.id, data);
                console.log("update", res);
                toast.success("Cập nhật thành công.")
                fetchSubscriptions();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            }
        } else {
            console.log("create");

            try {
                const res = await subscriptionService.createSubscriptions(data);
                console.log("create data", res);
                toast.success("Thêm thành công gói mới.")
                fetchSubscriptions();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            }

        }
        handleCloseModal();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Quản lý Gói Subscription
                    </h1>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <HiMiniPlus className="h-5 w-5" />
                        Thêm gói mới
                    </button>
                </div>


                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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


                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-red-600">
                                            {error}
                                        </td>
                                    </tr>
                                ) : subscriptions.length === 0 ? (
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
                                                <div className="text-sm text-green-700 font-medium">{formatCurrency(sub.price)}</div>


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
                                                        <HiMiniPencil className="h-5 w-5" />
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

            <SubscriptionFormModal
                show={showModal}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={editingSubscription}
            />
        </div>
    );
}