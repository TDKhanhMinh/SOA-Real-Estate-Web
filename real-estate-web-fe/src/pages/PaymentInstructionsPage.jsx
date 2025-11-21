import React, { useState } from 'react';
import { FaCreditCard, FaWallet, FaMobileAlt, FaQrcode, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const paymentSections = [
    {
        id: 'tong-quan-thanh-toan',
        icon: <FaCreditCard className="text-blue-500" />,
        title: '1. Tổng quan & Quy định chung',
        content: [
            { type: 'paragraph', text: 'Hệ thống của chúng tôi chấp nhận thanh toán qua ví điện tử (Momo, VNPay) và các loại thẻ ngân hàng nội địa. Vui lòng đảm bảo thông tin thanh toán của bạn là chính xác.' },
            { type: 'heading', text: 'Quy trình chung' },
            {
                type: 'list', items: [
                    'Chọn sản phẩm hoặc dịch vụ (Gói Membership, Nạp tiền vào Ví).',
                    'Chọn phương thức thanh toán mong muốn.',
                    'Thực hiện giao dịch theo hướng dẫn của cổng thanh toán.',
                    'Xác nhận giao dịch thành công trên hệ thống của chúng tôi.',
                ]
            }
        ]
    },
    {
        id: 'huong-dan-momo',
        icon: <FaMobileAlt className="text-pink-600" />,
        title: '2. Hướng dẫn Thanh toán qua Momo',
        content: [
            { type: 'heading', text: 'Bước 1: Chọn Momo' },
            { type: 'paragraph', text: 'Tại trang thanh toán, chọn biểu tượng Momo Wallet. Hệ thống sẽ chuyển hướng bạn đến cổng thanh toán của Momo.' },

            { type: 'heading', text: 'Bước 2: Quét Mã QR' },
            { type: 'paragraph', text: 'Sử dụng ứng dụng Momo trên điện thoại của bạn, chọn tính năng **Quét Mã** và quét mã QR hiển thị trên màn hình.' },
            { type: 'list', items: ['Kiểm tra lại số tiền và nội dung thanh toán (thường là mã đơn hàng).', 'Nhấn "Xác nhận Thanh toán" trên ứng dụng Momo.'] },

            { type: 'heading', text: 'Bước 3: Hoàn tất' },
            { type: 'paragraph', text: 'Sau khi thanh toán thành công, hệ thống sẽ tự động quay lại trang web của chúng tôi và hiển thị thông báo giao dịch thành công.' },
        ]
    },
    {
        id: 'huong-dan-vnpay',
        icon: <FaQrcode className="text-green-700" />,
        title: '3. Hướng dẫn Thanh toán qua VNPay',
        content: [
            { type: 'heading', text: 'Bước 1: Lựa chọn VNPay' },
            { type: 'paragraph', text: 'Chọn VNPay QR. Bạn sẽ được chuyển đến giao diện VNPay với mã QR thanh toán.' },

            { type: 'heading', text: 'Bước 2: Thanh toán bằng Ứng dụng Ngân hàng' },
            {
                type: 'list', items: [
                    'Mở ứng dụng Mobile Banking của bất kỳ ngân hàng nào được VNPay hỗ trợ (Vietcombank, Techcombank, Agribank,...).',
                    'Chọn tính năng **VNPay QR** hoặc **Quét Mã QR**.',
                    'Quét mã QR hiển thị trên màn hình máy tính/điện thoại của bạn.',
                ]
            },
            { type: 'paragraph', text: 'Xác nhận số tiền và nhập mã PIN/OTP để hoàn tất giao dịch.' }
        ]
    },
    {
        id: 'khac-phuc-su-co',
        icon: <FaExclamationTriangle className="text-orange-500" />,
        title: '4. Khắc phục sự cố Thường gặp',
        content: [
            { type: 'heading', text: 'Giao dịch báo thành công nhưng dịch vụ chưa được kích hoạt' },
            { type: 'paragraph', text: 'Vui lòng chờ tối đa 5 phút để hệ thống xử lý. Nếu sau 5 phút vẫn chưa có thay đổi, hãy liên hệ Bộ phận Hỗ trợ khách hàng (cung cấp mã giao dịch).' },
            { type: 'heading', text: 'Mã QR hết hạn' },
            { type: 'paragraph', text: 'Mã QR thường có thời hạn 15 phút. Vui lòng quay lại trang thanh toán, chọn lại phương thức để tạo mã QR mới.' }
        ]
    },
];

// Component render nội dung (Tái sử dụng từ InstructionsPage)
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


export default function PaymentInstructionsPage() {
    const [activeSection, setActiveSection] = useState(paymentSections[0].id);

    // Xử lý cuộn đến phần nội dung tương ứng
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
                    <FaWallet className="text-purple-600" />
                    Hướng dẫn Thanh toán
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Mục lục (Sidebar) */}
                    <div className="lg:w-1/4">
                        <div className="lg:sticky lg:top-20 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Mục lục</h3>
                            <nav className="space-y-2">
                                {paymentSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition duration-150 ${activeSection === section.id
                                                ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-500'
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
                        {paymentSections.map((section) => (
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