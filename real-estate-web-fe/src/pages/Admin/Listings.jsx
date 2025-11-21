import { useState, useEffect } from "react";
import { listingService } from "../../services/listingService ";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/formatCurrency";
import { getStatusLabel } from "../../utils/statusMapping";
import { formatDateTime } from './../../utils/formatDateTime';

const ADMIN_STATUS_TABS = [
    { code: "ALL", label: "Tất cả" },
    { code: "PENDING_APPROVAL", label: "Chờ duyệt" },
    { code: "AVAILABLE", label: "Đang hiển thị" },
    { code: "EXPIRED", label: "Hết hạn" },
    { code: "REJECTED", label: "Bị từ chối" },
];


export default function Listings() {
    const [properties, setProperties] = useState({ content: [] });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [expanded, setExpanded] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    const openLightbox = (url) => {
        setLightboxImage(url);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    const fetchAdminListings = async () => {
        try {
            setLoading(true);

            const statusParam = selectedStatus === "ALL" ? null : selectedStatus;

            const response = await listingService.getUserListingByAdmin(statusParam, page, 10);

            setProperties(response.data || { content: [] });
            console.log("return data", response.data);

            setTotalPages(response.data?.totalPages || 0);

        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            toast.error("Không thể tải danh sách bài đăng");
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi khi tab status thay đổi
    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
        setPage(0); // Reset page về 0 khi đổi trạng thái lọc
    };

    // useEffect chạy lại khi page HOẶC selectedStatus thay đổi
    useEffect(() => {
        // Cập nhật lại logic fetch để gọi hàm mới
        fetchAdminListings();
    }, [page, selectedStatus]);


    const handleActionPost = async (id, approved) => {
        // Có thể thêm Confirm Modal ở đây trước khi gọi API
        try {
            setLoading(true);
            if (approved === true) {
                await listingService.approveListing(id, { approved: true });
                toast.success("Duyệt bài thành công");
            } else {
                // Giả sử cần thêm logic lấy rejectReason từ Modal
                await listingService.approveListing(id, { approved: false, rejectReason: "Nội dung không phù hợp" });
                toast.success("Từ chối bài thành công");
            }

            // Fetch lại data sau khi hành động
            await fetchAdminListings();

        } catch (error) {
            console.error("Lỗi thực hiện thao tác:", error);
            toast.error("Không thể thực hiện thao tác do lỗi hệ thống");
        } finally {
            setLoading(false);
        }
    };

    const posts = properties.content || [];

    return (
        <main className="flex-1 p-6">
            <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Quản lý bài đăng</h2>


                <div className="flex flex-wrap gap-2 mb-6 border-b pb-3">
                    {ADMIN_STATUS_TABS.map((tab) => (
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
                    <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 opacity-50 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                            <p className="text-gray-600 text-lg">
                                Không có bài đăng nào ở trạng thái "{ADMIN_STATUS_TABS.find(t => t.code === selectedStatus)?.label}"
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">


                        <div className="grid grid-cols-12 bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b">
                            <div className="col-span-1 p-4">ID</div>
                            <div className="col-span-2 p-4">Người đăng</div>
                            <div className="col-span-2 p-4">Phân loại / Giá</div>
                            <div className="col-span-3 p-4">Tiêu đề (Mô tả)</div>
                            <div className="col-span-2 p-4 text-center">Trạng thái</div>
                            <div className="col-span-2 p-4 text-center">Hành động</div>
                        </div>


                        {posts.map((p) => (
                            <div key={p.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors duration-150">

                                <div className="grid grid-cols-12 items-center text-sm p-4">


                                    <div className="col-span-1 font-mono text-gray-500">#{p.id}</div>


                                    <div className="col-span-2 font-medium text-gray-800 truncate" title={p.realtorName}>
                                        {p.realtorName || 'N/A'}

                                        <div className="text-xs text-gray-500 truncate">{p.realtorEmail}</div>
                                    </div>


                                    <div className="col-span-2 text-gray-700">
                                        <span className="font-semibold">{p.propertyType}</span>
                                        <div className={`font-semibold ${p.propertyTransactionType === "SALE" ? "text-red-500" : "text-green-500"} text-sm`}>

                                            {formatCurrency(p.price)}
                                        </div>
                                    </div>


                                    <div className="col-span-3 text-gray-600 truncate" title={p.title}>
                                        {p.title}
                                    </div>


                                    <div className="col-span-2 flex justify-center">

                                        {getStatusLabel(p.status)}
                                    </div>


                                    <div className="col-span-2 flex justify-center gap-2">
                                        {p.status === "PENDING_APPROVAL" && (
                                            <>

                                                <button onClick={() => handleActionPost(p.id, true)} className="text-xs font-semibold px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                                    Duyệt
                                                </button>
                                                <button onClick={() => handleActionPost(p.id, false)} className="text-xs font-semibold px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                                    Từ chối
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                                            className="text-xs font-semibold px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Xem
                                        </button>
                                    </div>
                                </div>


                                {expanded === p.id && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-700 mb-2">Thông tin chi tiết:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                                            <div className="col-span-full">
                                                <span className="font-semibold">Địa chỉ:</span> {p.address}
                                            </div>


                                            <div className="font-medium">
                                                <span className="font-semibold">Diện tích:</span> {p.area} m²
                                            </div>
                                            <div className="font-medium">
                                                <span className="font-semibold">Tầng:</span> {p.floorNumber}
                                            </div>
                                            <div className="font-medium">
                                                <span className="font-semibold">Phòng:</span> {p.bedrooms} PN / {p.bathrooms} PT
                                            </div>
                                            <div className="font-medium">
                                                <span className="font-semibold">Pháp lý:</span> {p.legalPapers}
                                            </div>


                                            <div className="font-medium">
                                                <span className="font-semibold">Cập nhật:</span> {p.updatedAt ? formatDateTime(p.updatedAt) : 'N/A'}
                                            </div>
                                            <div className="font-medium">
                                                <span className="font-semibold">Hết hạn:</span> {p.expiresAt ? formatDateTime(p.expiresAt) : 'N/A'}
                                            </div>
                                            <div className="col-span-2 font-medium">
                                                <span className="font-semibold">Tiện ích:</span> {p.amenities || 'Không có'}
                                            </div>


                                            {p.status === "REJECTED" && p.rejectReason && (
                                                <div className="col-span-full mt-2">
                                                    <span className="font-semibold block mb-1 text-red-600">Lý do từ chối:</span>
                                                    <p className="text-red-500 italic border-l-2 pl-3 border-red-500">{p.rejectReason}</p>
                                                </div>
                                            )}


                                            <div className="col-span-full mt-2">
                                                <span className="font-semibold block mb-1">Mô tả:</span>
                                                <p className="text-gray-700 italic border-l-2 pl-3 border-blue-500">{p.description}</p>
                                            </div>
                                            <div className="col-span-1">
                                                {p.imageUrls && p.imageUrls.length > 0 ? (
                                                    <div className="flex space-x-1 overflow-x-auto p-1">
                                                        {p.imageUrls.map((item, index) => (
                                                            <img
                                                                onClick={() => openLightbox(item)}
                                                                key={index}
                                                                src={item}
                                                                alt={`Ảnh ${index}`}
                                                                className="w-10 h-10 object-cover rounded-md shadow flex-shrink-0"
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {lightboxImage && (
                            <div
                                onClick={closeLightbox}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm transition-opacity duration-300"
                            >
                                <div className="relative p-4 max-w-7xl max-h-[90vh]">

                                    <img
                                        src={lightboxImage}
                                        alt="Full screen view"
                                        onClick={(e) => e.stopPropagation()}
                                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                    />

                                    <button
                                        onClick={closeLightbox}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-3xl font-bold p-2 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-80 transition"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-2">
                                <span className="text-sm text-gray-600 mr-4">
                                    Trang {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((curr) => Math.max(0, curr - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPage((curr) => Math.min(totalPages - 1, curr + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}