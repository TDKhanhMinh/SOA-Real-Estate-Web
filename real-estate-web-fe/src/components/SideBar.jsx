import { useEffect, useState } from "react";
import Button from "./Button";
import { IoWalletOutline } from "react-icons/io5";

export default function Sidebar() {
    const [user, setUser] = useState({
        name: "",
        avatarUrl:
            "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg",
        accountBalance: 12000000,
        paymentCode: "1234567890",
    });

    useEffect(() => {

        fetchUserData();
    }, []);
    const fetchUserData = async () => {
        setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : user);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(user.paymentCode);
        alert("Mã chuyển khoản đã được sao chép!");
    };

    return (
        <div className="w-[20%] bg-white border-r min-h-screen p-4">
            <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                <img
                    className="rounded-full w-12 h-12 object-cover mb-2"
                    src={user.avatarUrl || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                    alt="photo"
                />
                <span className="font-bold text-gray-800">{user.name}</span>
            </div>

            <hr className="my-4 border-gray-400" />

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h6 className="font-semibold mb-2">Số dư tài khoản</h6>
                <div className="flex justify-between my-2">
                    <span>TK Chính</span>
                    <span className="text-green-600">
                        {user.accountBalance > 10000000
                            ? `${user.accountBalance / 1000000} triệu VNĐ`
                            : `${user.accountBalance} VNĐ`}
                    </span>
                </div>
                <div className="flex justify-between my-2">
                    <span>TK Khuyến mãi</span>
                    <span className="text-gray-600">0 VNĐ</span>
                </div>
                <div
                    className="cursor-pointer bg-white shadow rounded-lg text-center py-2 mt-4"
                    onClick={copyToClipboard}
                >
                    <h6 className="font-semibold">Mã chuyển khoản</h6>
                    <p className="text-sm text-gray-700">{user.paymentCode}</p>
                </div>
                <div className="flex justify-center mt-4">
                    <Button className="border border-green-500 text-green-600 rounded hover:bg-green-50 p-0 gap-2">
                        Nạp tiền
                    </Button>
                </div>
            </div>

            {/* Quản lý bài đăng */}
            <div className="mb-6">
                <h6 className="font-semibold  gap-2 mb-2 bg-gray-100 p-2 rounded">
                    Quản lý bài đăng
                </h6>
                <div className="flex flex-col gap-2">
                    <Button to={"/post"} className="text-start hover:bg-gray-200 w-full inline">Đăng mới</Button>
                    <Button to={"/account/listing"} className="text-start hover:bg-gray-200 w-full inline">Tin đã đăng</Button>
                    <Button className="text-start hover:bg-gray-200 w-full inline">Tin nháp</Button>
                </div>
            </div>

            {/* Quản lý tài khoản */}
            <div className="mb-6">
                <h6 className="font-semibold  gap-2 mb-2 bg-gray-100 p-2 rounded">
                    Quản lý tài khoản
                </h6>
                <div className="flex flex-col gap-2">
                    <Button className="text-start hover:bg-gray-200 w-full inline">Lịch sử nạp tiền</Button>
                    <Button to="/account/profile" className="text-start hover:bg-gray-200 w-full inline">Chỉnh sửa thông tin</Button>
                    <Button to="/account/change-password" className="text-start hover:bg-gray-200 w-full inline">Đổi mật khẩu</Button>
                </div>
            </div>

            {/* Gói hội viên */}
            <div className="mb-6">
                <h6 className="font-semibold  gap-2 mb-2 bg-gray-100 p-2 rounded">
                    Gói hội viên
                </h6>
                <div className="flex flex-col gap-2">
                    <Button to={"/account/membership"} className="text-start hover:bg-gray-200 w-full inline">Đăng ký mua</Button>
                    <Button to={"/account/my-subscription"} className="text-start hover:bg-gray-200 w-full inline">Gói đã mua</Button>
                </div>
            </div>

            {/* Hướng dẫn */}
            <div>
                <h6 className="font-semibold  gap-2 mb-2 bg-gray-100 p-2 rounded">
                    Hướng dẫn
                </h6>
                <div className="flex flex-col gap-2">
                    <Button className="text-start hover:bg-gray-200 w-full inline">Hướng dẫn sử dụng</Button>
                    <Button className="text-start hover:bg-gray-200 w-full inline">Hướng dẫn thanh toán</Button>
                </div>
            </div>
        </div>
    );
}

