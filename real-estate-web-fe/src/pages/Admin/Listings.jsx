import { useState, useEffect } from "react";

export default function Listings() {
    
    const [properties, setProperties] = useState([
        {
            propertyId: 1,
            user: { fullName: "Nguyễn Văn A" },
            propertyType: "Căn hộ",
            propertyTypeTransaction: "Bán",
            propertyDescription: "Căn hộ view sông, 75m², nội thất đầy đủ.",
            propertyStatus: "Chờ duyệt",
            address: { fullAddress: "159 Xa lộ Hà Nội, TP.HCM" },
            propertyPrice: "3.2 tỷ",
            squareMeters: 75,
            bedrooms: 2,
            bathrooms: 2,
            propertyLegal: "Sổ đỏ",
            propertyInterior: "Cơ bản",
            isAvailable: false,
        },
        {
            propertyId: 2,
            user: { fullName: "Trần Thị B" },
            propertyType: "Nhà phố",
            propertyTypeTransaction: "Cho thuê",
            propertyDescription: "Nhà phố Quận 7, diện tích 120m².",
            propertyStatus: "Đã duyệt",
            address: { fullAddress: "Quận 7, TP.HCM" },
            propertyPrice: "25 triệu/tháng",
            squareMeters: 120,
            bedrooms: 3,
            bathrooms: 3,
            propertyLegal: "Hợp đồng thuê",
            propertyInterior: "Đầy đủ",
            isAvailable: true,
        },
    ]);

    const [expanded, setExpanded] = useState(null);
    const [notification, setNotification] = useState("Thao tác thành công!");

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <main className="flex-1 p-6">
            {/* Notification */}
            {notification && (
                <div className="fixed top-5 right-5 bg-green-100 text-green-700 border border-green-700 px-4 py-2 rounded shadow">
                    {notification}
                </div>
            )}

            {/* Nếu không có bài đăng */}
            {properties.length === 0 ? (
                <div className="flex justify-center items-center h-96 bg-white rounded shadow">
                    <div className="flex flex-col items-center">
                        <img
                            src="https://img.icons8.com/ios/100/000000/document--v1.png"
                            alt="empty"
                            className="mb-4"
                        />
                        <p className="text-gray-600 text-lg">Không có bài đăng nào</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    {/* Header row */}
                    <div className="grid grid-cols-10 bg-white shadow p-4 font-bold">
                        <div>ID</div>
                        <div className="col-span-2 text-center">Người đăng</div>
                        <div className="text-center">Phân loại</div>
                        <div className="text-center">Hình thức GD</div>
                        <div className="col-span-2 text-center">Mô tả</div>
                        <div className="text-center">Trạng thái</div>
                        <div className="col-span-2 text-center">Action</div>
                    </div>

                    {properties.map((p) => (
                        <div key={p.propertyId} className="bg-white shadow mt-2">
                            <div className="grid grid-cols-10 items-center p-4">
                                <div>{p.propertyId}</div>
                                <div className="col-span-2 text-center">{p.user.fullName}</div>
                                <div className="text-center">{p.propertyType}</div>
                                <div className="text-center">{p.propertyTypeTransaction}</div>
                                <div className="col-span-2 truncate">{p.propertyDescription}</div>
                                <div className="text-center">{p.propertyStatus}</div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    {p.propertyStatus === "Chờ duyệt" && (
                                        <>
                                            <button className="px-2 py-1 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white">
                                                Duyệt
                                            </button>
                                            <button className="px-2 py-1 border-2 border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white">
                                                Từ chối
                                            </button>
                                        </>
                                    )}
                                    <button className="px-2 py-1 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white">
                                        Xóa
                                    </button>
                                </div>
                                <div className="col-span-10 flex justify-center mt-2">
                                    <button
                                        onClick={() =>
                                            setExpanded(expanded === p.propertyId ? null : p.propertyId)
                                        }
                                        className="bg-gray-200 px-4 py-1 rounded-full hover:bg-gray-300"
                                    >
                                        {expanded === p.propertyId ? "Ẩn chi tiết ▲" : "Xem chi tiết ▼"}
                                    </button>
                                </div>
                            </div>

                            {expanded === p.propertyId && (
                                <div className="p-4 bg-gray-50">
                                    <div className="grid grid-cols-7 gap-2">
                                        <div className="col-span-2">{p.address.fullAddress}</div>
                                        <div className="text-red-500">{p.propertyPrice}</div>
                                        <div>{p.squareMeters} m²</div>
                                        <div>{p.bedrooms} PN</div>
                                        <div>{p.bathrooms} PT</div>
                                        <div>{p.propertyLegal}</div>
                                        <div>{p.propertyInterior}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
