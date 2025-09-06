import React from "react";
import Button from "./Button";
import { Link } from 'react-router-dom';
import { formatCurrency } from './../utils/formatCurrency';

export default function PropertyList() {
    const properties = [
        {
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
        }
    ];

    return (
        <div className="container mx-auto mt-10 bg-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-bold">Bất động sản dành cho bạn</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {properties.map((p) => (
                    <Link to={`/info/${p.propertyId}`}
                        key={p.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <img
                            src={p.listImages?.[0]?.imageUrl}
                            alt={p.title}
                            className="w-full h-36 object-cover"
                        />
                        <div className="p-2">
                            <h6 className="font-semibold truncate">{p.propertyTitle}</h6>
                            <p className="text-red-600 font-bold">
                                {formatCurrency(p.propertyPrice)} · {p.squareMeters} m²
                            </p>
                            <p className="text-sm text-gray-500">{p.address.fullAddress}</p>
                            <p className="text-xs text-gray-400">{Date.now()}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Button className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-200">
                    Xem thêm
                </Button>
            </div>
        </div>
    );
}
