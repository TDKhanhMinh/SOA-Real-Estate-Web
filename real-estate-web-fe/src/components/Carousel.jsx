import { useState, useEffect } from "react";
// Import icons từ thư viện react-icons nếu bạn đang sử dụng nó
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Carousel() {
    const images = [
        "https://massogroup.com/wp-content/uploads/2019/03/banner-zalo-1280x600-1.png",
        "https://inanaz.com.vn/wp-content/uploads/2020/02/poster-bat-dong-san-8.jpg",
        "https://storage.googleapis.com/digital-platform/hinh_anh_bat_dong_san_nghi_duong_la_gi_nhung_loai_hinh_pho_bien_so_2_fa62771395/hinh_anh_bat_dong_san_nghi_duong_la_gi_nhung_loai_hinh_pho_bien_so_2_fa62771395.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // --- LOGIC TỰ ĐỘNG CHUYỂN SLIDE (Giữ nguyên) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 7000);

        return () => clearInterval(interval);
    }, [images.length]);

    // --- HÀM CHUYỂN SLIDE BẰNG NÚT ---
    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full max-w-screen-xl mx-auto group">

            {/* 1. KHU VỰC HIỂN THỊ ẢNH CHÍNH */}
            <div className="overflow-hidden rounded-lg shadow-xl relative">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    // Loại bỏ 'transition duration-500' trực tiếp trên <img>
                    // Thêm object-cover để đảm bảo tỷ lệ ảnh đẹp
                    className="w-full h-96 object-cover"
                />
            </div>

            {/* 2. NÚT ĐIỀU HƯỚNG TRÁI/PHẢI (Thêm hiệu ứng hover) */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
                {/* Nút Previous */}
                <button
                    onClick={goToPrev}
                    // Hiển thị chỉ khi hover (group-hover:opacity-100)
                    className="p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/80"
                    aria-label="Previous slide"
                >
                    <FaChevronLeft className="w-5 h-5" />
                </button>

                {/* Nút Next */}
                <button
                    onClick={goToNext}
                    className="p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/80"
                    aria-label="Next slide"
                >
                    <FaChevronRight className="w-5 h-5" />
                </button>
            </div>


            {/* 3. CHỈ SỐ DOTS VÀ THAO TÁC NGƯỜI DÙNG */}
            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex
                                ? "bg-blue-600 w-6" // Nổi bật dot đang chọn bằng cách kéo dài width
                                : "bg-gray-300 hover:bg-gray-500" // Thêm hiệu ứng hover
                            }`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Lưu ý: Để có hiệu ứng chuyển đổi mượt mà (slide/fade), bạn cần sử dụng thư viện như Framer Motion, react-transition-group, hoặc chỉnh sửa CSS phức tạp hơn (ví dụ: áp dụng transform/translate cho các ảnh nằm cạnh nhau). */}
        </div>
    );
}

export default Carousel;