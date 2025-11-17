export const BankTransferInfo = ({ user, onShowModal }) => (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-lg bg-gray-100 p-6 w-full">

                <div className="md:col-span-1">
                    <h6 className="font-bold">Ưu đãi nạp tiền</h6>
                    <p className="text-xs text-gray-600">
                        Chỉ cần số tiền nạp nằm trong mức ưu đãi, tiền sẽ tự động cộng vào Tài khoản Khuyến mãi.
                    </p>
                    <button type="button" onClick={onShowModal} className="text-orange-600 text-sm font-medium mt-2">
                        Xem tất cả ưu đãi &gt;
                    </button>
                </div>

                <div className="md:col-span-3 grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-center h-28 flex flex-col justify-between">
                        <div className="font-bold text-sm">Dưới 2 triệu</div>
                        <hr />
                        <span className="text-sm text-gray-700">+0% giá trị</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm text-center h-28 flex flex-col justify-between">
                        <div className="font-bold text-sm">Từ 2 triệu - dưới 4 triệu</div>
                        <hr />
                        <span className="text-sm text-gray-700">+14% giá trị</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm text-center h-28 flex flex-col justify-between">
                        <div className="font-bold text-sm">Từ 4 triệu - dưới 8 triệu</div>
                        <hr />
                        <span className="text-sm text-gray-700">+16% giá trị</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <h6 className="font-semibold text-gray-800">Cú pháp và nội dung chuyển khoản</h6>
            <div className="bg-gray-100 p-4 rounded-lg mt-2 inline-block">
                Mã giao dịch_Họ và tên_Số điện thoại liên hệ
            </div>
            <p className="text-sm text-gray-700 mt-2">
                <strong>Lưu ý:</strong> Mã giao dịch là mã chuyển khoản của riêng bạn. Bạn vui lòng nhập đúng mã ở đầu nội dung chuyển khoản để việc xác nhận giao dịch được nhanh chóng và chính xác.
            </p>
        </div>

        <div className="mt-4">
            <h6 className="font-semibold text-gray-800">Ví dụ:</h6>
            <div className="bg-gray-100 p-4 rounded-lg mt-2 inline-block font-mono">
                {`${user.paymentCode}_${user.fullName}_${user.phone}`}
            </div>
        </div>

        <div className="mt-6">
            <h6 className="font-semibold text-gray-800 mb-2">Ngân hàng</h6>
            <div className="border rounded-lg p-6 max-w-2xl">
                <img
                    className="w-36 border rounded-md mb-4"
                    src="https://batdongsan.com.vn/sellernet/static/media/vietcombank.09686245.jpg" alt="Vietcombank"
                />
                <div className="space-y-3 text-sm">
                    <div className="flex">
                        <span className="w-36 font-semibold text-gray-600">Tên ngân hàng:</span>
                        <span className="font-medium text-gray-800">Ngân hàng thương mại cổ phần ngoại thương Việt Nam - Vietcombank</span>
                    </div>
                    <div className="flex">
                        <span className="w-36 font-semibold text-gray-600">Tên tài khoản:</span>
                        <span className="font-medium text-gray-800">Tập đoàn Bất động sản Thỏ bảy màu Việt Nam</span>
                    </div>
                    <div className="flex">
                        <span className="w-36 font-semibold text-gray-600">Số tài khoản:</span>
                        <span className="font-medium text-gray-800">0451000217801</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
