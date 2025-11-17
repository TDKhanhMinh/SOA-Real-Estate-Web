import React, { useState } from 'react';

import { formatCurrency } from '../../utils/formatCurrency';
import { BankLogoGrid, MomoIcon, TransferIcon, VnPayIcon } from '../../assets/js/logo';
import { CountdownTimer } from '../../components/CountdownTimer';
import { useLocation } from 'react-router-dom';
const mockUser = {
    fullName: 'Nguyễn Trường Nam',
    imageUrl: 'https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg',
    accountBalance: 1250000,
    paymentCode: 'NAP123456',
    phone: '090xxxxxxx',
    userPayment: {
        paymentId: '152'
    }
};



export default function MomoPayment() {
    const location = useLocation();
    const amount = location.state;
    const [user] = useState(mockUser);

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="flex flex-nowrap w-full">
                <main className="w-4/5 pt-28 pb-10 px-10 bg-gray-50 w-full">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">Nạp tiền vào tài khoản</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-4">
                        <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center border border-gray-200">
                            <VnPayIcon />
                            <h6 className="text-sm font-semibold mt-1">QR (VNPAY)</h6>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center ring-2 ring-black">
                            <MomoIcon />
                            <h6 className="text-sm font-semibold mt-1">Ví MoMo</h6>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center border border-gray-200">
                            <TransferIcon />
                            <h6 className="text-sm font-semibold mt-1">Chuyển khoản</h6>
                        </div>
                    </div>

                    <hr className="my-8" />

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-7/12">
                                <div
                                    className="rounded-lg flex flex-col items-center justify-center bg-[#e11b90] h-[530px] p-4"
                                    style={{ backgroundImage: 'url(https://homepage.momocdn.net/jk/momo2020/img/intro/qrcode-pattern.png)' }}
                                >
                                    <h5 className="text-white text-lg font-semibold mt-4">Quét mã QR để thanh toán</h5>
                                    <img
                                        className="rounded-lg w-full max-w-[350px] h-auto aspect-square my-4"
                                        src="https://res.cloudinary.com/dsj6sba9f/image/upload/v1763012458/download_pvak41.jpg"
                                        alt="Momo QR Code"
                                    />
                                    <h6 className="text-white text-center text-sm max-w-xs">
                                        Sử dụng <strong>App MoMo</strong> hoặc ứng dụng camera hỗ trợ QR code để quét mã
                                    </h6>
                                </div>
                            </div>

                            <div className="w-full lg:w-5/12 space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <h5 className="text-lg font-bold mb-3">Thông tin thanh toán</h5>
                                    <hr className="mb-4" />
                                    <h6 className="text-sm font-semibold text-gray-600">Nhà cung cấp</h6>
                                    <div className="flex items-center gap-3 py-2">
                                        <img
                                            className="rounded-full w-10 h-10"
                                            src="https://res.cloudinary.com/dsj6sba9f/image/upload/v1745247841/c085ad076c442c8191e6b7f48ef59aad_k7izor.jpg" // Cần đảm bảo đường dẫn
                                            alt="Provider logo"
                                        />
                                        <div className="text-sm uppercase font-bold text-gray-800">
                                            Tập đoàn Bất động sản Thỏ bảy màu VIỆT NAM
                                        </div>
                                    </div>
                                    <hr className="my-2" />

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <h6 className="text-gray-600">Mã đơn hàng</h6>
                                            <span className="font-medium text-gray-800">{user.userPayment.paymentId}</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between">
                                            <h6 className="text-gray-600">Mô tả</h6>
                                            <span className="font-medium text-gray-800">Nạp tiền vào tài khoản</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between">
                                            <h6 className="text-gray-600">Số tiền</h6>
                                            <span className="font-bold text-lg text-green-600">{formatCurrency(amount)}</span>
                                        </div>
                                    </div>

                                    <h6 className="mt-6 font-semibold text-gray-700 text-center">Mã QR sẽ hết hiệu lực sau</h6>
                                    <CountdownTimer />
                                </div>

                                <div>
                                    <h6 className="font-semibold text-gray-800 mb-2">Các ngân hàng hỗ trợ thanh toán MOMO</h6>
                                    <BankLogoGrid />
                                </div>

                                <div className="text-right mt-4">
                                    <a href="/account/profile" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
                                        Về trang chủ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}