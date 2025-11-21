import { useState } from "react";
import Button from "./Button"; // Giả định component Button đã tồn tại
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { listingService } from "../services/listingService ";

// Thêm các icons để tăng tính trực quan cho bộ lọc
import { FaHome, FaMoneyBillWave, FaListAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function SearchForm() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        search: "", // Đổi null thành chuỗi rỗng để tránh warning
        transactionType: null,
        propertyType: null,
        minPrice: null,
        maxPrice: null,
        priceRange: "" // Đổi null thành chuỗi rỗng
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        let newForm = { ...form, [name]: value };

        if (name === "priceRange") {
            if (value) {
                // Xử lý giá trị "max" đặc biệt
                const [min, max] = value.split('-');
                newForm.minPrice = min === "0" ? null : min;
                newForm.maxPrice = max === "max" ? null : max;
            } else {
                newForm.minPrice = "";
                newForm.maxPrice = "";
            }
        }
        setForm(newForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { priceRange, ...finalForm } = form;

        const filteredForm = Object.fromEntries(
            Object.entries(finalForm).filter(([_, value]) => value !== null && value !== "")
        );

        const queryParams = new URLSearchParams(filteredForm).toString();

        try {
            const result = await listingService.getAllListing(
                form.search,
                form.transactionType,
                form.propertyType,
                form.minPrice,
                form.maxPrice
            );
            navigate(`/search-result?${queryParams}`, { state: result.data });
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        }
    };

    // Định nghĩa các loại nhà đất (Sử dụng đối tượng để dễ bảo trì)
    const propertyTypes = [
        { value: "", label: "Loại nhà đất (Tất cả)" },
        { value: "1", label: "Tất cả nhà đất" },
        { value: "2", label: "Căn hộ chung cư" },
        { value: "3", label: "Nhà riêng" },
        { value: "4", label: "Đất nền" },
        { value: "5", label: "Biệt thự, liền kề" },
    ];

    // Định nghĩa các mức giá (Thêm "max" để dễ xử lý)
    const priceRanges = [
        { value: "", label: "Mức giá (Tất cả)" },
        { value: "0-500000000", label: "Dưới 500 triệu" },
        { value: "500000000-1000000000", label: "500 triệu - 1 tỷ" },
        { value: "1000000000-2000000000", label: "1 tỷ - 2 tỷ" },
        { value: "2000000000-5000000000", label: "2 tỷ - 5 tỷ" },
        { value: "5000000000-10000000000", label: "5 tỷ - 10 tỷ" },
        { value: "10000000000-max", label: "Trên 10 tỷ" }, // Thay thế số lớn bằng 'max'
    ];


    return (
        <div className="max-w-5xl mx-auto -mt-16 relative z-10"> {/* Điều chỉnh vị trí */}
            {/* Thẻ bao ngoài: Đổi màu nền và thêm hiệu ứng đổ bóng */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">

                {/* 1. THANH TÌM KIẾM CHÍNH */}
                <form onSubmit={handleSubmit} className="flex gap-3 items-center">

                    {/* Ô nhập liệu */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            name="search"
                            value={form.search}
                            onChange={handleChange}
                            placeholder="Nhập vị trí, khu vực, dự án hoặc từ khóa..."
                            // Tăng kích thước và làm tròn góc
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Nút Tìm kiếm ngay (Ẩn nút cũ) */}
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 flex items-center gap-2"
                    >
                        <FaSearch />
                        Tìm kiếm
                    </button>
                </form>

                {/* 2. NÚT MỞ RỘNG (Gắn liền với form) */}
                <div className="text-center mt-4">
                    <button
                        type="button" // Đảm bảo không submit form
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition duration-200 flex items-center mx-auto"
                    >
                        {isOpen ? (
                            <>
                                Ẩn tìm kiếm chi tiết <IoIosArrowUp className="ml-1" />
                            </>
                        ) : (
                            <>
                                Tìm kiếm chi tiết <IoIosArrowDown className="ml-1" />
                            </>
                        )}
                    </button>
                </div>

                {/* 3. KHU VỰC TÌM KIẾM CHI TIẾT */}
                {isOpen && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <h5 className="font-bold text-gray-700 mb-3">Bộ lọc nâng cao</h5>

                        <div className="space-y-4">

                            {/* Hàng 1: Loại Giao dịch (Sử dụng Button-like radio) */}
                            <div className="flex gap-4">
                                <label className={`flex-1 flex justify-center items-center py-3 rounded-lg cursor-pointer transition duration-150 border-2 ${form.transactionType === "SALE" ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        value="SALE"
                                        checked={form.transactionType === "SALE"}
                                        onChange={handleChange}
                                        className="hidden" // Ẩn radio mặc định
                                    />
                                    <FaMoneyBillWave className="mr-2" /> Nhà đất Bán
                                </label>
                                <label className={`flex-1 flex justify-center items-center py-3 rounded-lg cursor-pointer transition duration-150 border-2 ${form.transactionType === "RENT" ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        value="RENT"
                                        checked={form.transactionType === "RENT"}
                                        onChange={handleChange}
                                        className="hidden" // Ẩn radio mặc định
                                    />
                                    <FaHome className="mr-2" /> Nhà đất Cho thuê
                                </label>
                            </div>

                            {/* Hàng 2: Loại Bất động sản và Mức giá */}
                            <div className="flex gap-4">
                                {/* Chọn Loại nhà đất */}
                                <div className="flex-1 relative">
                                    <FaListAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        name="propertyType"
                                        value={form.propertyType || ""}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 px-4 pl-12 py-3 rounded-xl focus:border-blue-500 outline-none appearance-none bg-white transition"
                                    >
                                        {propertyTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Chọn Mức giá */}
                                <div className="flex-1 relative">
                                    <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        name="priceRange"
                                        value={form.priceRange}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 px-4 pl-12 py-3 rounded-xl focus:border-blue-500 outline-none appearance-none bg-white transition"
                                    >
                                        {priceRanges.map(range => (
                                            <option key={range.value} value={range.value}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Nút Tìm kiếm chi tiết (Ẩn nút submit cũ) */}
                        <div className="text-right mt-6">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition duration-200"
                            >
                                Áp dụng Bộ lọc
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}