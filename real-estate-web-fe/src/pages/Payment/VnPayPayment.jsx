import React, { useState } from 'react';
import {
    HiOutlineClipboardCopy, HiOutlinePlusCircle, HiOutlineClipboardList,
    HiOutlineClipboardCheck, HiOutlineUserCircle, HiOutlineCog,
    HiOutlineCash, HiOutlineLockClosed, HiOutlineShoppingBag,
    HiOutlineBookOpen, HiOutlineTicket, HiOutlineQrcode
} from 'react-icons/hi';
import { formatCurrency } from '../../utils/formatCurrency';
import { BankLogoGrid, MomoIcon, TransferIcon, VnPayIcon } from '../../assets/js/logo';
import { CountdownTimer } from '../../components/CountdownTimer';



const mockAmount = 500000;


export default function VnPayPayment() {
    const [amount] = useState(mockAmount);

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="flex flex-nowrap w-full">
                <main className="w-4/5 pt-28 pb-10 px-10 bg-gray-50 w-full">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">Nạp tiền vào tài khoản</h3>

                    <div className="max-w-4xl mx-auto">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-4">
                            <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center ring-2 ring-black">
                                <VnPayIcon />
                                <h6 className="text-sm font-semibold mt-1">QR (VNPAY)</h6>
                            </div>
                            <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center border border-gray-200">
                                <MomoIcon />
                                <h6 className="text-sm font-semibold mt-1">Ví MoMo</h6>
                            </div>
                            <div className="bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center border border-gray-200">
                                <TransferIcon />
                                <h6 className="text-sm font-semibold mt-1">Chuyển khoản</h6>
                            </div>
                        </div>

                        <hr className="my-8" />


                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-6">


                                <div className="w-full md:w-2/5 flex-shrink-0">
                                    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                                        <img
                                            className="rounded-lg w-full max-w-[200px] h-auto aspect-square"
                                            src="https://res.cloudinary.com/dsj6sba9f/image/upload/v1763012859/vnpay_phfrmc.jpg"
                                            alt="VNPAY QR Code"
                                        />
                                        <div className="flex justify-between w-full max-w-[200px] mt-2">
                                            <span className="text-sm">Tổng tiền</span>
                                            <span className="font-bold text-sm">{formatCurrency(amount)}</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="w-full md:w-3/5">
                                    <h6 className="font-semibold text-lg">Quét mã QR để thanh toán</h6>
                                    <div className="space-y-3 mt-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                            <span>Mở ứng dụng ngân hàng có hỗ trợ VNPAY QR trên điện thoại</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                            <span className="inline-flex items-center gap-1">Trên ứng dụng chọn tính năng <HiOutlineQrcode className="w-5 h-5" /> Quét mã QR</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                            <span>Quét mã QR này và thanh toán</span>
                                        </div>
                                    </div>

                                    <h6 className="mt-6 font-semibold text-gray-700 text-center">Mã QR sẽ hết hiệu lực sau</h6>
                                    <CountdownTimer />
                                </div>
                            </div>

                            <h6 className="mt-6 font-semibold text-gray-800 mb-2">Các ngân hàng hỗ trợ thanh toán VNPAY</h6>
                            <BankLogoGrid />

                            <div className="text-right mt-6 pt-6 border-t">
                                <a href="/account/profile" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
                                    Về trang chủ
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}