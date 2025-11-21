import React, { useState } from 'react';
import { FaBookOpen, FaLightbulb, FaTools, FaQuestionCircle, FaStar } from 'react-icons/fa';

const instructionsData = [
    {
        id: 'tong-quan',
        icon: <FaBookOpen className="text-blue-500" />,
        title: '1. Tổng quan & Giới thiệu',
        content: [
            { type: 'paragraph', text: 'Chào mừng bạn đến với hệ thống quản lý bất động sản của chúng tôi. Trang này cung cấp hướng dẫn chi tiết về cách sử dụng các tính năng chính của nền tảng.' },
            { type: 'heading', text: 'Nguyên tắc cơ bản' },
            { type: 'list', items: ['Đảm bảo bạn đã đăng nhập bằng tài khoản có vai trò phù hợp (User/Realtor/Admin).', 'Sử dụng thanh tìm kiếm để nhanh chóng truy cập các tính năng hoặc bài đăng.'] }
        ]
    },
    {
        id: 'quan-ly-tai-khoan',
        icon: <FaStar className="text-green-500" />,
        title: '2. Quản lý Tài khoản Cá nhân',
        content: [
            { type: 'paragraph', text: 'Tất cả các cài đặt cá nhân, thông tin liên hệ và lịch sử hoạt động đều nằm trong khu vực Tài khoản (/account).' },
            { type: 'heading', text: 'Cập nhật Profile' },
            { type: 'paragraph', text: 'Truy cập /account/profile để thay đổi tên, số điện thoại và cập nhật ảnh đại diện.' },
            { type: 'paragraph', text: 'Lưu ý: Mọi thay đổi sẽ có hiệu lực ngay lập tức.' }
        ]
    },
    {
        id: 'dang-bai',
        icon: <FaTools className="text-yellow-500" />,
        title: '3. Hướng dẫn Đăng bài',
        content: [
            { type: 'heading', text: 'Quy trình đăng bài mới' },
            {
                type: 'list', items: [
                    'Chọn "Đăng bài" từ menu chính hoặc truy cập /account/post.',
                    'Điền đầy đủ thông tin chi tiết về bất động sản (Địa chỉ, Diện tích, Giá, Mô tả).',
                    'Tải lên ít nhất 3 ảnh chất lượng cao.',
                    'Chọn gói thành viên phù hợp (Membership) để kích hoạt bài đăng.',
                ]
            },
            { type: 'paragraph', text: 'Bài đăng sẽ trải qua quá trình kiểm duyệt trước khi hiển thị công khai.' }
        ]
    },
    {
        id: 'thanh-toan',
        icon: <FaLightbulb className="text-red-500" />,
        title: '4. Thanh toán & Nạp tiền',
        content: [
            { type: 'paragraph', text: 'Hệ thống hỗ trợ nhiều phương thức thanh toán trực tuyến và nạp tiền vào ví cá nhân.' },
            { type: 'heading', text: 'Lịch sử giao dịch' },
            { type: 'paragraph', text: 'Bạn có thể xem lại tất cả các giao dịch (nạp tiền, thanh toán gói) tại /account/payment-history.' }
        ]
    },
];

// Component nội dung con (render nội dung dựa trên type)
const ContentRenderer = ({ content }) => (
    <>
        {content.map((item, index) => {
            if (item.type === 'paragraph') {
                return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{item.text}</p>;
            }
            if (item.type === 'heading') {
                return <h4 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 border-b pb-1">{item.text}</h4>;
            }
            if (item.type === 'list') {
                return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-700">
                        {item.items.map((listItem, i) => (
                            <li key={i}>{listItem}</li>
                        ))}
                    </ul>
                );
            }
            return null;
        })}
    </>
);

export default function InstructionsPage() {
    const [activeSection, setActiveSection] = useState(instructionsData[0].id);

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4 flex items-center gap-3">
                    <FaQuestionCircle className="text-blue-600" />
                    Hướng dẫn sử dụng
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    
                    <div className="lg:w-1/4">
                        <div className="lg:sticky lg:top-20 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Mục lục</h3>
                            <nav className="space-y-2">
                                {instructionsData.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition duration-150 ${activeSection === section.id
                                                ? 'bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {section.icon}
                                        <span className="text-sm">{section.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    
                    <div className="lg:w-3/4 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        {instructionsData.map((section) => (
                            <section key={section.id} id={section.id} className="mb-10 pt-4 pb-6 border-b last:border-b-0">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    {section.icon}
                                    {section.title}
                                </h2>
                                <ContentRenderer content={section.content} />
                            </section>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}