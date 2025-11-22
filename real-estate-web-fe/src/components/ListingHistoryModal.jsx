import React, { useEffect, useState } from 'react';
import {
    BookOpen,
} from 'lucide-react';
import { formatDateTime } from '../utils/formatDateTime';
import { formatCurrency } from '../utils/formatCurrency';
import { Modal } from './Modal';
import { listingService } from '../services/listingService ';
import { BsPostcard } from "react-icons/bs";
import { getStatusLabel } from '../utils/statusMapping';


export function ListingHistoryModal({ userId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const openLightbox = (url) => {
        setLightboxImage(url);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };
    useEffect(() => {
        if (isOpen) {
            fetchListingHistory();
        }
    }, [isOpen]);

    const fetchListingHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listingService.getUserAllUserListingByAdmin(userId);
            setHistory(res.data || []);
            console.log("lis data", await listingService.getUserAllUserListingByAdmin(userId));

        } catch (err) {
            console.error("Failed to fetch subscription history:", err);
            setError("Không thể tải lịch sử. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={fetchListingHistory} className="mt-2 text-sm text-blue-600 hover:underline">Thử lại</button>
                </div>
            );
        }

        if (!history || history.content?.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <BookOpen className="w-12 h-12 mb-3 opacity-30" />
                    <p>Chưa có lịch sử bài đăng nào.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4 w-full">
                <div className="overflow-x-auto w-full">
                    <div className="w-full">
                        <div className="h-[450px]  overflow-y-auto border rounded-lg">
                            {history.content?.map((p) => (
                                <div key={p.id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors duration-150">

                                    <div className="grid grid-cols-12 items-center text-sm p-4 min-w-full">

                                        <div className="col-span-1 font-mono text-gray-500">#{p.id}</div>

                                        <div className="col-span-5 font-medium text-gray-800 truncate" title={p.realtorName}>
                                            {p.realtorName || 'N/A'}

                                            <div className="text-xs text-gray-500 truncate">{p.realtorEmail}</div>
                                        </div>

                                        <div className="col-span-4 text-gray-700">
                                            <span className="font-semibold">{p.propertyType}</span>
                                            <div className={`font-semibold ${p.propertyTransactionType === "SALE" ? "text-red-500" : "text-green-500"} text-sm`}>

                                                {formatCurrency(p.price)}
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex justify-center gap-2">
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
                                                <div className="col-span-3 text-gray-600 truncate" title={p.title}>

                                                    <span className="font-semibold">Tiêu đề :</span>{p.title}
                                                </div>


                                                <div className="col-span-2">
                                                    <span className="font-semibold">Trạng thái:</span> {getStatusLabel(p.status)}-{p.isDeleted ? "ĐÃ XÓA" : ""}
                                                </div>

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
                                                <div className="col-span-full">
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
                        </div>
                    </div>
                </div>


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
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group text-left"
            >
                <BsPostcard className="text-2xl text-green-600" />
                <span className="text-lg">Lịch sử bài đăng</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Lịch sử bài đăng"
                className={"max-w-6xl mt-4"}
            >
                <div className="p-4">
                    {renderContent()}
                </div>
            </Modal>
        </>
    );
}