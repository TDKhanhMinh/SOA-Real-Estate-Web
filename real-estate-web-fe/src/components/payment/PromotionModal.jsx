import {
    HiX, HiOutlineInformationCircle
} from 'react-icons/hi';
export const PromotionModal = ({ show, onClose }) => {
    if (!show) return null;

    const promotions = [
        { range: 'Dưới 2 triệu', rate: '0%' },
        { range: 'Từ 2 triệu - Dưới 4 triệu', rate: '14%' },
        { range: 'Từ 4 triệu - Dưới 8 triệu', rate: '16%' },
        { range: 'Từ 8 triệu - Dưới 12 triệu', rate: '18%' },
        { range: 'Từ 12 triệu - Dưới 18 triệu', rate: '21%' },
        { range: 'Từ 18 triệu - Dưới 30 triệu', rate: '24%' },
        { range: 'Từ 30 triệu - Dưới 50 triệu', rate: '27%' },
        { range: 'Từ 50 triệu - Dưới 100 triệu', rate: '30%' },
        { range: 'Từ 100 triệu - Dưới 200 triệu', rate: '33%' },
        { range: 'Từ 200 triệu - Dưới 300 triệu', rate: '34%' },
        { range: 'Từ 300 triệu - Dưới 500 triệu', rate: '35%' },
        { range: 'Từ 500 triệu - Dưới 1 tỷ', rate: '36%' },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h5 className="text-xl font-bold">Ưu đãi nạp tiền</h5>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <HiX className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-3 mb-4">
                        <HiOutlineInformationCircle className="w-6 h-6" />
                        Nạp đúng định mức để nhận được đồng thời các chương trình khuyến mãi.
                    </div>
                    <h6 className="font-semibold mb-2">Khuyến mãi trong năm</h6>
                    <div className="border rounded-lg">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-t-lg">
                            <span className="font-bold text-gray-700">Số tiền nạp vào</span>
                            <span className="font-bold text-gray-700">Tỉ lệ khuyến mãi</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {promotions.map((promo, index) => (
                                <div key={index} className="flex justify-between p-3 border-t">
                                    <span>{promo.range}</span>
                                    <span className="font-medium pr-8">{promo.rate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};