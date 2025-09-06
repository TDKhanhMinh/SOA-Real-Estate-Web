import React from "react";
import { useNavigate } from "react-router-dom";

export default function PlaceSection() {
    const navigate = useNavigate();

    const places = [
        {
            name: "TP. Hồ Chí Minh",
            count: "66.045 tin đăng",
            img: "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
        },
        {
            name: "Hà Nội",
            count: "55.816 tin đăng",
            img: "https://file4.batdongsan.com.vn/images/newhome/cities1/HN-web-1.jpg",
        },
        {
            name: "Đà Nẵng",
            count: "10.253 tin đăng",
            img: "https://file4.batdongsan.com.vn/images/newhome/cities1/DDN-web-1.jpg",
        },
        {
            name: "Bình Dương",
            count: "8.742 tin đăng",
            img: "https://file4.batdongsan.com.vn/images/newhome/cities1/BD-web-1.jpg",
        },
        {
            name: "Đồng Nai",
            count: "3.894 tin đăng",
            img: "https://file4.batdongsan.com.vn/images/newhome/cities1/DNA-web-1.jpg",
        },
    ];

    const handleClick = (city) => {
        navigate(`/search-result?city=${encodeURIComponent(city)}`);
    };

    return (
        <div className="container mx-auto mt-10 max-w-6xl">
            <h4 className="text-xl font-bold mb-4">Bất động sản theo địa điểm</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Place lớn */}
                <div
                    onClick={() => handleClick(places[0].name)}
                    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
                >
                    <img
                        src={places[0].img}
                        alt={places[0].name}
                        className="w-full h-[375px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 text-white font-bold">
                        <p>{places[0].name}</p>
                        <p className="underline text-sm">{places[0].count}</p>
                    </div>
                </div>

                {/* Các place nhỏ */}
                <div className="grid grid-cols-2 gap-4">
                    {places.slice(1).map((p, i) => (
                        <div
                            key={i}
                            onClick={() => handleClick(p.name)}
                            className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
                        >
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-[175px] object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 text-white font-semibold drop-shadow">
                                <p>{p.name}</p>
                                <p className="underline text-xs">{p.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
