import React, { useEffect, useState } from "react";
import Button from "./Button"; // Giả định component Button đã tồn tại
import { Link } from 'react-router-dom';
import { formatCurrency } from './../utils/formatCurrency'; // Giả định hàm formatCurrency
import { listingService } from "../services/listingService "; // Giả định service
import { formatDateTime } from './../utils/formatDateTime'; // Giả định hàm formatDateTime
import { FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa'; // Icons
import { BiArea } from 'react-icons/bi'; // Icon

export default function PropertyList() {
    const [properties, setProperties] = useState([]);

    const fetchProperties = async () => {
        // Giả định API trả về { data: { content: [...] } }
        const res = await listingService.getAllListing();
        setProperties(res.data || []);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Lấy mảng content ra để dễ sử dụng
    const propertyContent = properties.content || [];

    return (
        // Thẻ chứa tổng thể: Cải thiện padding, thêm border
        <div className="container mx-auto mt-10 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h4 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
                Bất động sản dành cho bạn
            </h4>

            {/* Vòng lặp hiển thị danh sách - Thay đổi: grid-cols-4 trên mọi màn hình trừ mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {propertyContent.map((p) => (
                    // Thẻ Bất động sản (Cải tiến UI/UX)
                    <Link to={`/info/${p.id}`}
                        key={p.id}
                        // Hiệu ứng Hover: Nâng lên, bóng đổ mạnh hơn, viền màu
                        className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500 border border-gray-200"
                    >
                        {/* Khu vực ảnh */}
                        <div className="relative overflow-hidden">
                            <img
                                src={p.imageUrls[0]}
                                alt={p.title}
                                // Hiệu ứng zoom ảnh khi hover
                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Tag Loại Giao dịch */}
                            <span
                                className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded text-white ${p.propertyTransactionType === "SALE" ? "bg-red-500" : "bg-green-500"
                                    }`}
                            >
                                {p.propertyTransactionType === "SALE" ? "BÁN" : "CHO THUÊ"}
                            </span>
                        </div>

                        {/* Khu vực Nội dung */}
                        <div className="p-3">
                            {/* Tiêu đề */}
                            <h6
                                className="font-bold text-gray-800 truncate mb-1 group-hover:text-blue-600 transition"
                                title={p.title}
                            >
                                {p.title}
                            </h6>

                            {/* Giá & Diện tích (Tách ra 2 dòng cho rõ ràng) */}
                            <p className="text-xl font-extrabold text-red-600">
                                {formatCurrency(p.price)}
                            </p>

                            {/* Thông số phòng/diện tích */}
                            <div className="flex justify-between text-sm text-gray-600 mt-1 mb-2">
                                <div className="flex items-center gap-1">
                                    <BiArea className="text-blue-500" />
                                    <span>{p.area} m²</span>
                                </div>
                                {p.bedrooms && (
                                    <div className="flex items-center gap-1">
                                        <FaBed className="text-blue-500" />
                                        <span>{p.bedrooms} PN</span>
                                    </div>
                                )}
                                {p.bathrooms && (
                                    <div className="flex items-center gap-1">
                                        <FaBath className="text-blue-500" />
                                        <span>{p.bathrooms} PT</span>
                                    </div>
                                )}
                            </div>

                            {/* Địa chỉ */}
                            <p className="text-xs text-gray-500 flex items-center mt-1 truncate" title={p.address}>
                                <FaMapMarkerAlt className="w-3 h-3 mr-1 text-gray-400" />
                                {p.address}
                            </p>

                            <p className="text-xs text-gray-400 mt-2 border-t pt-2">
                                Đăng lúc {formatDateTime(p.updatedAt)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}