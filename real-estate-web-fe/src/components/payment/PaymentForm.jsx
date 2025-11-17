import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentForm = ({ paymentMethod }) => {
    const [money, setMoney] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [error, setError] = useState('');
    const navigate= useNavigate()
    const quickAmounts = [500000, 1000000, 2000000, 5000000, 7000000, 10000000];

    const amount = parseFloat(money || selectedAmount) || 0;
    const vat = amount * 0.1;
    const total = amount - vat;

    const handleMoneyChange = (e) => {
        setMoney(e.target.value);
        setSelectedAmount(null);
        if (error) setError('');
    };

    const handleQuickSelect = (value) => {
        setSelectedAmount(value);
        setMoney(''); 
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            setError('Vui lòng chọn số tiền cần nạp');
        } else {
            setError('');
            console.log('Submitting form:', { paymentMethod, amount });
            // Gửi form...
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <input type="hidden" name="paymentMethod" value={paymentMethod} />

            <label className="mb-2 font-bold text-gray-700" htmlFor="money">
                Nhập số tiền bạn muốn nạp (VNĐ)
            </label>
            <input
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nạp từ 2.000.000 VNĐ để nhận được khuyến mãi"
                type="number"
                name="money"
                id="money"
                min="0"
                value={money}
                onChange={handleMoneyChange}
            />

            <h6 className="font-light text-gray-600 pt-4 pb-2">Hoặc chọn nhanh</h6>
            <div className="grid grid-cols-3 gap-4">
                {quickAmounts.map((value) => (
                    <div
                        key={value}
                        onClick={() => handleQuickSelect(value)}
                        className={`border rounded-lg h-16 flex items-center justify-center cursor-pointer transition-all ${selectedAmount === value
                            ? 'border-green-500 border-2 bg-green-50 text-green-600 font-bold'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <h5 className="text-sm md:text-base">{value.toLocaleString()} VNĐ</h5>
                        <input type="radio" hidden name="moneyValue" value={value} checked={selectedAmount === value} readOnly />
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <h6 className="mt-6 font-bold">Thông tin nạp tiền</h6>
            <div className="flex justify-between mt-2 text-sm">
                <span className="mx-2 text-gray-600">Khấu trừ thuế GTGT 10%</span>
                <span id="VAT" className="mx-2 font-medium">
                    - {vat.toLocaleString()} VNĐ
                </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center">
                <span className="mx-2 font-semibold">Số tiền cộng vào tài khoản</span>
                <span id="result" className="mx-2 text-xl font-bold text-green-600">
                    {total.toLocaleString()} VNĐ
                </span>
            </div>
            <hr className="my-3" />
            <div className="text-right mt-3">
                <button onClick={()=>navigate("/account/vnpay")} className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700" type="submit">
                    Tiếp tục
                </button>
            </div>
        </form>
    );
};