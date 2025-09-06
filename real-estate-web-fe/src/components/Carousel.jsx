import { useState, useEffect } from "react";

function Carousel() {
    const images = [
        "https://massogroup.com/wp-content/uploads/2019/03/banner-zalo-1280x600-1.png",
        "https://inanaz.com.vn/wp-content/uploads/2020/02/poster-bat-dong-san-8.jpg",
        "https://storage.googleapis.com/digital-platform/hinh_anh_bat_dong_san_nghi_duong_la_gi_nhung_loai_hinh_pho_bien_so_2_fa62771395/hinh_anh_bat_dong_san_nghi_duong_la_gi_nhung_loai_hinh_pho_bien_so_2_fa62771395.jpg"

    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 7000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-screen-xl mx-auto">
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full rounded-lg shadow-lg transition duration-500"
            />

            <div className="flex justify-center gap-2 mt-3">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-3 w-3 rounded-full cursor-pointer ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;
