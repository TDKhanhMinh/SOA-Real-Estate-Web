import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
    HiOutlineClipboardCopy, HiCheckCircle, HiOutlinePlusCircle,
    HiOutlineClipboardList, HiOutlineClipboardCheck, HiOutlineDocumentText,
    HiOutlineUserCircle, HiOutlineCog, HiOutlineCash, HiOutlineLockClosed,
    HiOutlineShoppingBag, HiOutlineBookOpen, HiOutlineTicket, HiOutlineCollection
} from "react-icons/hi";


const formatCurrency = (balance) => {
    if (balance > 10000000) {
        return `${balance / 1000000} triệu VNĐ`;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance);
};

const menuSections = [
    {
        title: "Quản lý bài đăng",
        icon: <HiOutlineClipboardList className="w-5 h-5" />,
        links: [
            { name: "Đăng mới", to: "/post", icon: <HiOutlinePlusCircle className="w-5 h-5" /> },
            { name: "Tin đã đăng", to: "/account/listing", icon: <HiOutlineClipboardCheck className="w-5 h-5" /> },
            { name: "Tin nháp", to: "/account/drafts", icon: <HiOutlineDocumentText className="w-5 h-5" /> },
        ]
    },
    {
        title: "Quản lý tài khoản",
        icon: <HiOutlineUserCircle className="w-5 h-5" />,
        links: [
            { name: "Lịch sử nạp tiền", to: "/account/payment-history", icon: <HiOutlineCash className="w-5 h-5" /> },
            { name: "Chỉnh sửa thông tin", to: "/account/profile", icon: <HiOutlineCog className="w-5 h-5" /> },
            { name: "Đổi mật khẩu", to: "/account/change-password", icon: <HiOutlineLockClosed className="w-5 h-5" /> },
        ]
    },
    {
        title: "Gói hội viên",
        icon: <HiOutlineTicket className="w-5 h-5" />,
        links: [
            { name: "Tất cả gói", to: "/account/membership", icon: <HiOutlineCollection className="w-5 h-5" /> },
            { name: "Gói của tôi", to: "/account/my-subscription", icon: <HiOutlineShoppingBag className="w-5 h-5" /> },
        ]
    },
    {
        title: "Hướng dẫn",
        icon: <HiOutlineBookOpen className="w-5 h-5" />,
        links: [
            { name: "Hướng dẫn sử dụng", to: "/help/usage", icon: null }, // Thêm 'to'
            { name: "Hướng dẫn thanh toán", to: "/help/payment", icon: null }, // Thêm 'to'
        ]
    }
];

export default function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Tên người dùng",
        avatarUrl: "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg",
        accountBalance: 12000000,
        paymentCode: "1234567890",
    });
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const loadUserFromStorage = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        loadUserFromStorage();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user.paymentCode);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000); 
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 w-full text-left p-3 rounded-md transition-colors text-sm font-medium ${isActive
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <aside className="w-72 flex-shrink-0 bg-white border-r h-screen overflow-y-auto sticky top-0">
            <div className="p-4 flex flex-col gap-4">
                
                <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
                    <img
                        className="rounded-full w-12 h-12 object-cover mb-2"
                        src={user.avatarUrl || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                        alt="photo"
                    />
                    <span className="font-bold text-gray-800">{user.name}</span>
                </div>

                
                <div className="bg-gray-100 rounded-lg p-4">
                    <h6 className="font-semibold mb-2">Số dư tài khoản</h6>
                    <div className="flex justify-between my-2 text-sm">
                        <span>TK Chính</span>
                        <span className="text-green-600 font-medium">
                            {formatCurrency(user.accountBalance)}
                        </span>
                    </div>
                    <div className="flex justify-between my-2 text-sm">
                        <span>TK Khuyến mãi</span>
                        <span className="text-gray-600 font-medium">0 VNĐ</span>
                    </div>
                    <div
                        className="cursor-pointer bg-white shadow rounded-lg text-center py-2 px-3 mt-4"
                        onClick={copyToClipboard}
                    >
                        <h6 className="font-semibold text-sm">Mã chuyển khoản</h6>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-sm text-blue-600 font-bold">{user.paymentCode}</p>
                            {isCopied ? (
                                <HiCheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <HiOutlineClipboardCopy className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => navigate("/account/payment")}
                            className="w-full h-10 flex items-center justify-center gap-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold text-sm"
                        >
                            <HiOutlineCash className="w-5 h-5" />
                            Nạp tiền
                        </button>
                    </div>
                </div>

                <hr className="my-2 border-gray-200" />

                
                <nav className="flex flex-col gap-4">
                    {menuSections.map((section) => (
                        <div key={section.title}>
                            <h6 className="font-semibold text-gray-500 text-xs uppercase p-2 mb-1 flex items-center gap-2">
                                {section.icon}
                                {section.title}
                            </h6>
                            <div className="flex flex-col gap-1">
                                {section.links.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        to={link.to}
                                        className={navLinkClass}
                                    >
                                        {link.icon && (
                                            <span className="w-5 h-5">{link.icon}</span>
                                        )}
                                        <span>{link.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}