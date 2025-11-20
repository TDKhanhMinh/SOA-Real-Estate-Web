import { useEffect, useState } from "react";
import GoongMap from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { Link, useParams } from "react-router-dom";
import { listingService } from "../services/listingService ";
import PropertyImageGallery from "../components/PropertyImageGallery";

export default function PropertyInfo() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    const fetchListingsDetails = async () => {
        try {
            setProperty(await listingService.getListingDetails(id));
            console.log("property", await listingService.getListingDetails(id));

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchListingsDetails()
    }, [id])
    useEffect(() => {

        if (property?.longitude && property?.latitude) {
            GoongMap.accessToken =
                "ZJrUrOf5fwOvZxzLVV4KmTPTsqhCkmvh0uVRruyY";
            const map = new GoongMap.Map({
                container: "map",
                style: "https://tiles.goong.io/assets/goong_map_web.json",
                center: [property.longitude, property.latitude],
                zoom: 15,
            });

            new GoongMap.Marker()
                .setLngLat([property.longitude, property.latitude])
                .addTo(map);

            return () => map.remove();
        }
    }, [property]);

    return (
        <div className="pt-40">
            <div className="max-w-7xl mx-auto flex gap-6">
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg shadow p-4">
                        <PropertyImageGallery property={property} />
                        <h2 className="text-lg font-bold uppercase mt-4">
                            {property?.title}
                        </h2>
                        <p className="text-gray-600">{property?.address}</p>

                        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                            <div>
                                <p className="text-gray-500">Mức giá</p>
                                <p className="font-bold text-red-600">
                                    {property?.price > 1_000_000_000
                                        ? `${property?.price / 1_000_000_000} tỷ`
                                        : `${property?.price / 1_000_000} triệu`}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Diện tích</p>
                                <p className="font-bold">{property?.area} m²</p>
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

                    <div className="bg-white rounded-lg shadow p-4 mt-6">
                        <h3 className="text-lg font-semibold mb-2">Thông tin mô tả</h3>
                        <p className="text-gray-700">{property?.description}</p>
                    </div>

                    {property?.longitude && property?.latitude && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Xem trên bản đồ</h3>
                            <div id="map" className="w-full h-[400px] rounded-lg"></div>
                        </div>
                    )}
                </div>

                <div className="w-60 space-y-6">
                    <div className="sticky top-44 rounded-lg shadow border border-gray-200 overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            paddingBottom: '1px'
                        }}
                    >
                        <div className="h-14">

                        </div>
                        <div className=" text-center py-3 text-lg font-semibold">
                            Môi giới chuyên nghiệp
                        </div>

                        <div className="bg-white rounded-b-lg p-4 pt-16 -mt-10 relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                <img
                                    src={property?.avatar || "https://tse4.mm.bing.net/th/id/OIP.9_MptOLxjJEGSGukPt9FWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                                />
                                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-blue-500 rounded-full p-1 border-2 border-white">
                                    <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-center mt-4 mb-6 text-gray-800">
                                {property?.realtorName}
                            </h3>

                            <div className="space-y-3">
                                <button
                                    className="w-full flex items-center justify-center p-3 border border-blue-200 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition"
                                >
                                    Chat qua Zalo
                                </button>
                                <a
                                    href={`tel:${property?.realtorPhone}`}
                                    className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                                >{property?.realtorPhone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
