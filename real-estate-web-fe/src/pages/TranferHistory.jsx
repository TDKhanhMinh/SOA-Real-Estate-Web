import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { listingService } from "../services/listingService ";
import { formatDateTime } from "../utils/formatDateTime";
import { toast } from "react-toastify";
import EditPostModal from "../components/EditPostModal";
import ConfirmModal from "../components/ConfirmModal";
import { getStatusLabel } from "../utils/statusMapping";
import PropertyActionsDropdown from "../components/PropertyActionsDropdown";

const STATUS_TABS = [
    { code: "ALL", label: "Tất cả" },
    { code: "SOLD", label: "Đã bán" },
    { code: "RENTED", label: "Đã cho thuê" },
];


export default function TransferHistory() {
    const [properties, setProperties] = useState({ content: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState("ALL");

    const fetchUserListings = async (statusFilter) => {
        try {
            setLoading(true);

            const statusParam = statusFilter === "ALL" ? null : statusFilter;

            const response = await listingService.transferHistoryListing(statusParam, page, 10);

            setProperties(response.data || { content: [] });
            setTotalPages(response.data?.totalPages || 0);

        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            toast.error("Không thể tải danh sách bài đăng");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
        setPage(0);
    };

    useEffect(() => {
        fetchUserListings(selectedStatus);
    }, [page, selectedStatus]);

    const handleEdit = (post) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleSelectedDelete = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedPost?.id) {
            setIsModalOpen(false);
            return;
        }
        try {
            await listingService.deleteListing(selectedPost.id);
            toast.success("Xóa bài thành công");
            setIsModalOpen(false);
            fetchUserListings(selectedStatus);
        } catch (error) {
            console.error("Lỗi xóa bài:", error);
            toast.error("Xóa thất bại");
        }
    };

    const handlePostListing = async (id) => {
        try {
            await listingService.submitDraftListing(id);
            toast.success("Gửi duyệt bài thành công");
            fetchUserListings(selectedStatus);
        } catch (error) {
            console.error("Lỗi gửi duyệt:", error);
            toast.error("Không thể gửi bài cho quản trị viên");
        }
    };
    const handleRentedListing = async (id) => {
        try {
            await listingService.hasRentedListing(id);
            console.log("rented", await listingService.hasRentedListing(id));
            toast.success("Thao tác thành công");
            fetchUserListings(selectedStatus);
        } catch (error) {
            console.error("Lỗi gửi duyệt:", error);
            toast.error("Không thể gửi bài cho quản trị viên");
        }
    };
    const handleSoldListing = async (id) => {
        try {
            await listingService.hasSoldListing(id);
            toast.success("Thao tác thành công");
            fetchUserListings(selectedStatus);
        } catch (error) {
            console.error("Lỗi gửi duyệt:", error);
            toast.error("Không thể gửi bài cho quản trị viên");
        }
    };
    const handleHidden = async (id) => {
        try {
            await listingService.hiddenListing(id);
            toast.success("Thao tác thành công");
            fetchUserListings(selectedStatus);
        } catch (error) {
            console.error("Lỗi gửi duyệt:", error);
            toast.error("Không thể gửi bài cho quản trị viên");
        }
    };

    const TableImage = ({ src }) => {
        return (
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 border border-gray-300">
                {src ? (
                    <img src={src} alt="Property" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>
        );
    };

    const posts = properties.content || [];

    return (
        <div className="w-full bg-gray-50 min-h-screen p-6">
            <div className="bg-white shadow-xl rounded-xl p-6">
                <div className="flex flex-wrap gap-2 mb-6 border-b pb-3">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.code}
                            onClick={() => handleStatusChange(tab.code)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
                                ${selectedStatus === tab.code
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>


                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        <svg className="animate-spin h-5 w-5 mr-3 inline text-blue-500" viewBox="0 0 24 24"></svg>
                        Đang tải dữ liệu...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                        <p className="text-lg">Không có tin đăng nào ở trạng thái "{STATUS_TABS.find(t => t.code === selectedStatus)?.label}"</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                <div className="h-[550px] overflow-y-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Ảnh</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Tiêu đề</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Trạng thái</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Ngày cập nhật</th>
                                                <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {posts.map((p) => (
                                                <tr key={p.id} className="hover:bg-gray-50">
                                                    <td className="p-3 text-sm text-gray-500 font-mono">#{p.id}</td>
                                                    <td className="p-3">
                                                        <TableImage src={p.imageUrls?.[0]} />
                                                    </td>
                                                    <td className="p-3 max-w-xs truncate font-medium text-gray-800" title={p.title}>
                                                        {p.title}
                                                    </td>
                                                    <td className="p-3">
                                                        {getStatusLabel(p.status)}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-500">
                                                        {formatDateTime(p.updatedAt)}
                                                    </td>
                                                    <td className="p-3 text-center space-x-2 whitespace-nowrap">
                                                        <PropertyActionsDropdown
                                                            p={p}
                                                            handlePostListing={handlePostListing}
                                                            handleSoldListing={handleSoldListing}
                                                            handleRentedListing={handleRentedListing}
                                                            handleEdit={handleEdit}
                                                            handleHidden={handleHidden}
                                                            handleSelectedDelete={handleSelectedDelete}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>


                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
                                <span className="text-sm text-gray-600 mr-4">
                                    Trang {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((curr) => Math.max(0, curr - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPage((curr) => Math.min(totalPages - 1, curr + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>


            <EditPostModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={selectedPost}
                onSuccess={() => {
                    fetchUserListings(selectedStatus); // Fetch lại data sau khi sửa
                }}
            />
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa bài viết '${selectedPost?.title}' này không?`}
            />
        </div>
    );
}