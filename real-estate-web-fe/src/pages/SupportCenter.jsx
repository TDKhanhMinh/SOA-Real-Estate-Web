import { FaEnvelope, FaPhoneAlt, FaFacebook, FaComments } from "react-icons/fa";

export default function SupportCenter() {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-700 to-green-500 p-6 text-white">
                <h2 className="text-sm font-semibold">Xin chào Trần Đỗ Khánh Minh</h2>
                <p className="text-sm">Chúng tôi giúp được gì cho bạn</p>

                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi, từ khoá..."
                        className="w-full rounded-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <span className="absolute right-4 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="divide-y">
                <div className="p-4">
                    <h3 className="font-semibold text-green-700 mb-3">Về Chúng tôi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <a href="#" className="flex justify-between border-b pb-2 hover:text-green-600">
                            Tôi muốn mua gói hội viên thì thực hiện như thế nào? <span>›</span>
                        </a>
                        <a href="#" className="flex justify-between border-b pb-2 hover:text-green-600">
                            Tôi có thể tích điểm như thế nào? <span>›</span>
                        </a>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-green-700 mb-3">Chính sách</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <a href="#" className="flex justify-between border-b pb-2 hover:text-green-600">
                            Tôi có thể sử dụng hoá đơn chưa tích điểm để tích điểm cho thành viên Chúng tôi được không?
                            <span>›</span>
                        </a>
                        <a href="#" className="flex justify-between border-b pb-2 hover:text-green-600">
                            Chính sách bảo mật như thế nào?
                            <span>›</span>
                        </a>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-green-700 mb-3">Liên Hệ hỗ trợ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-blue-500" />
                            <a href="mailto:customerservice@phuclong.masangroup.com" className="hover:underline">
                                customerservice@t7m.com
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFacebook className="text-blue-600" />
                            <a href="https://m.me/phuclongcoffeeandtea" className="hover:underline">
                                https://m.me/t7m
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhoneAlt className="text-green-600" />
                            <span>1900234518 (Ext.01)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaComments className="text-blue-400" />
                            <a href="https://zalo.me/3547667082335355338" className="hover:underline">
                                https://zalo.me/3547667082335355338
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
