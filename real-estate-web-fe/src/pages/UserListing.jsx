import { useState } from "react";
import Button from "../components/Button";

export default function UserListing() {
    const [properties, setProperties] = useState([
        {
            propertyId: 1,
            propertyTitle: "Căn hộ cao cấp Vinhomes Central Park",
            propertyStatus: "Đang hiển thị",
            postInformation: { datePost: "20/11/2024" },
            listImages: [
                {
                    imageUrl:
                        "https://file4.batdongsan.com.vn/2022/09/29/20220929145332-07f5.jpg",
                },
            ],
        },
        {
            propertyId: 2,
            propertyTitle: "Nhà phố Quận 7 - đường lớn",
            propertyStatus: "Đang ẩn",
            postInformation: { datePost: "10/11/2024" },
            listImages: [
                {
                    imageUrl:
                        "https://file4.batdongsan.com.vn/2022/09/29/20220929145354-b43f.jpg",
                },
            ],
        },
    ]);

    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = () => {
        setProperties(properties.filter((p) => p.propertyId !== deleteId));
        setDeleteId(null);
    };

    return (
        <div className="w-full bg-gray-100">
            <div className="bg-white shadow rounded-lg p-6">

                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <img
                            src="https://img.icons8.com/ios/100/000000/document--v1.png"
                            alt="no-post"
                            className="mb-4"
                        />
                        <h6 className="py-2">Không có tin đăng nào</h6>
                        <Button
                            href="/post"
                            className="btn bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Đăng tin mới
                        </Button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold mb-4">Tin đã đăng</h3>
                        <table className="table-auto w-full border">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2">Mã tin</th>
                                    <th className="p-2">Ảnh</th>
                                    <th className="p-2">Tiêu đề</th>
                                    <th className="p-2">Trạng thái</th>
                                    <th className="p-2">Ngày đăng</th>
                                    <th className="p-2 text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((p) => (
                                    <tr key={p.propertyId} className="border-t hover:bg-gray-50">
                                        <td className="p-2">{p.propertyId}</td>
                                        <td className="p-2">
                                            <img
                                                src={p.listImages[0].imageUrl}
                                                alt="Property"
                                                className="w-28 h-20 rounded-md object-cover"
                                            />
                                        </td>
                                        <td className="p-2 max-w-xs truncate">{p.propertyTitle}</td>
                                        <td className="p-2">{p.propertyStatus}</td>
                                        <td className="p-2">{p.postInformation.datePost}</td>
                                        <td className="p-2 text-center space-x-2">
                                            <Button
                                                href={`/user/update-post/${p.propertyId}`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                onClick={() => setDeleteId(p.propertyId)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Modal confirm */}
                {deleteId && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                            <h5 className="text-lg font-bold mb-4">Xóa bài đăng</h5>
                            <p>Bạn có chắc chắn muốn xóa bài đăng này không?</p>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Đóng
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
