import {
    X,
    BarChart3,
    Star,
    Calendar,
    CheckCircle2,
    ShoppingCart
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { FeatureItem } from './Chart';


export function SubscriptionDetailModal({ show, onClose, onBuy, data }) {
    if (!show || !data) return null;
    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="
                    bg-white rounded-2xl shadow-xl 
                    w-full max-w-md 
                    max-h-[85vh] overflow-y-auto 
                    transform transition-all duration-300
                    flex flex-col relative
                "
                onClick={(e) => e.stopPropagation()}
            >

                <div className="h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }}
                    ></div>

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition hover:cursor-pointer backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-4 -mt-10 flex flex-col z-10">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-white">{data.name}</h2>
                        <div className="flex items-center justify-center gap-1 mt-4">
                            <span className="text-2xl font-extrabold text-blue-600">
                                {formatCurrency(data.price)}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                                / {data.duration} ngày
                            </span>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-5 border border-blue-100">
                        <p className="text-gray-600 text-sm text-center italic">
                            "{data.description || 'Nâng cấp ngay để trải nghiệm những tính năng tuyệt vời nhất.'}"
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Quyền lợi gói
                        </h4>

                        <FeatureItem
                            icon={BarChart3}
                            label="Giới hạn bài đăng"
                            value={`${data.maxPost} bài`}
                            highlight
                        />
                        <FeatureItem
                            icon={Star}
                            label="Độ ưu tiên hiển thị"
                            value={`Mức ${data.priority}`}
                        />
                        <FeatureItem
                            icon={Calendar}
                            label="Thời hạn bài đăng"
                            value={`${data.postExpiryDays} ngày`}
                        />
                        <FeatureItem
                            icon={CheckCircle2}
                            label="Hỗ trợ kỹ thuật"
                            value="24/7"
                        />
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <button
                            onClick={() => onBuy(data)}
                            className="
                                w-full py-3 
                                bg-gradient-to-r from-blue-600 to-indigo-600 
                                text-white rounded-lg font-bold text-base 
                                shadow-md hover:shadow-lg 
                                transition active:scale-95 flex items-center justify-center gap-2
                            "
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Mua Gói Ngay
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-2">
                            Thanh toán an toàn & kích hoạt ngay lập tức
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
