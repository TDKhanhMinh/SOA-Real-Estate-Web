import { useEffect, useState } from "react";
import GoongMap from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { Link, useParams } from "react-router-dom";

export default function PropertyInfo() {
    const { id } = useParams();
    const [property, setProperty] = useState({
        propertyId: 1,
        propertyTitle: "Căn hộ cao cấp Masteri Thảo Điền",
        propertyDescription:
            "Căn hộ view sông, nội thất đầy đủ, tiện ích cao cấp, gần trung tâm thương mại.",
        propertyPrice: 3200000000,
        squareMeters: 75,
        bedrooms: 2,
        bathrooms: 2,
        propertyLongitude: 106.7305,
        propertyLatitude: 10.8019,
        address: {
            fullAddress: "159 Xa lộ Hà Nội, P.Thảo Điền, Quận 2, TP.HCM",
        },
        listImages: [
            {
                imageUrl:
                    "https://file4.batdongsan.com.vn/2022/09/29/20220929145332-07f5.jpg",
            },
            {
                imageUrl:
                    "https://file4.batdongsan.com.vn/2022/09/29/20220929145354-b43f.jpg",
            },
            {
                imageUrl:
                    "https://file4.batdongsan.com.vn/2022/09/29/20220929145409-dc5b.jpg",
            },
        ],
    });

    const randomProperty = [
        {
            propertyId: 2,
            propertyTitle: "Nhà phố Quận 7",
            propertyPrice: 5200000000,
            squareMeters: 90,
            listImages: [
                { imageUrl: "https://file4.batdongsan.com.vn/2023/01/01/img1.jpg" },
            ],
        },
        {
            propertyId: 3,
            propertyTitle: "Chung cư Vinhomes Central Park",
            propertyPrice: 4000000000,
            squareMeters: 70,
            listImages: [
                { imageUrl: "https://file4.batdongsan.com.vn/2023/01/01/img2.jpg" },
            ],
        },
    ];

    useEffect(() => {
        if (property?.propertyLongitude && property?.propertyLatitude) {
            GoongMap.accessToken =
                "ZJrUrOf5fwOvZxzLVV4KmTPTsqhCkmvh0uVRruyY";
            const map = new GoongMap.Map({
                container: "map",
                style: "https://tiles.goong.io/assets/goong_map_web.json",
                center: [property.propertyLongitude, property.propertyLatitude],
                zoom: 15,
            });

            new GoongMap.Marker()
                .setLngLat([property.propertyLongitude, property.propertyLatitude])
                .addTo(map);

            return () => map.remove();
        }
    }, [property]);

    return (
        <div className="pt-20">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-4">
                <img
                    src={property?.listImages?.[0]?.imageUrl}
                    alt="Main"
                    className="w-full h-[350px] object-cover rounded-lg"
                />
                <div className="flex gap-2 mt-3 overflow-x-auto">
                    {property?.listImages?.map((img, i) => (
                        <img
                            key={i}
                            src={img.imageUrl}
                            alt="thumb"
                            className="w-32 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                        />
                    ))}
                </div>
                <h2 className="text-lg font-bold uppercase mt-4">
                    {property?.propertyTitle}
                </h2>
                <p className="text-gray-600">{property?.address?.fullAddress}</p>

                <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                    <div>
                        <p className="text-gray-500">Mức giá</p>
                        <p className="font-bold text-red-600">
                            {property?.propertyPrice > 1_000_000_000
                                ? `${property.propertyPrice / 1_000_000_000} tỷ`
                                : `${property.propertyPrice / 1_000_000} triệu`}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Diện tích</p>
                        <p className="font-bold">{property?.squareMeters} m²</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Phòng ngủ</p>
                        <p className="font-bold">{property?.bedrooms} PN</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Phòng tắm</p>
                        <p className="font-bold">{property?.bathrooms} PT</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">Thông tin mô tả</h3>
                <p className="text-gray-700">{property?.propertyDescription}</p>
            </div>

            {property?.propertyLongitude && property?.propertyLatitude && (
                <div className="max-w-5xl mx-auto mt-6">
                    <h3 className="text-lg font-semibold mb-2">Xem trên bản đồ</h3>
                    <div id="map" className="w-full h-[400px] rounded-lg"></div>
                </div>
            )}

            <div className="max-w-6xl mx-auto mt-10">
                <h3 className="text-lg font-semibold mb-4">Gợi ý cho bạn</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {randomProperty?.map((item) => (
                        <Link to={`/info/${item.propertyId}`}
                            key={item.propertyId}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                        >
                            <img
                                src={item.listImages?.[0]?.imageUrl}
                                alt="thumb"
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-3">
                                <h4 className="font-bold text-sm truncate">
                                    {item.propertyTitle}
                                </h4>
                                <p className="text-red-600 font-bold">
                                    {item.propertyPrice > 1_000_000_000
                                        ? `${item.propertyPrice / 1_000_000_000} tỷ`
                                        : `${item.propertyPrice / 1_000_000} triệu`}
                                </p>
                                <p className="text-gray-500">{item.squareMeters} m²</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
