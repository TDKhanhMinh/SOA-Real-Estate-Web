import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResult({ properties = [] }) {
    const [sortOption, setSortOption] = useState("");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "Toàn quốc";

    // TODO: fetch API theo city
    console.log("City hiện tại:", city);

    const handleSort = (option) => {
        setSortOption(option);
        console.log("Sort by:", option);
        // TODO: gọi API sort
    };

    return (
        <div className="container mx-auto mt-6">
            <div className="flex justify-center">
                <div className="flex justify-between w-4/5">
                    <h4 className="font-bold">
                        {city === "Toàn quốc"
                            ? "Mua bán và cho thuê nhà trên toàn quốc"
                            : `Mua bán và cho thuê nhà tại ${city}`}
                    </h4>
                    <div className="relative">
                        <button className="w-48 rounded-lg flex justify-between items-center bg-white border px-4 py-2">
                            <span>
                                {sortOption === "priceDesc"
                                    ? "Giá cao → thấp"
                                    : sortOption === "priceAsc"
                                        ? "Giá thấp → cao"
                                        : sortOption === "sqftDesc"
                                            ? "Diện tích cao → thấp"
                                            : sortOption === "sqftAsc"
                                                ? "Diện tích thấp → cao"
                                                : "Thông thường"}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 ml-2"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M3.2 5h9.6L8 10.5z" />
                            </svg>
                        </button>
                        {/* Dropdown menu */}
                        <ul className="absolute hidden group-hover:block bg-white shadow rounded-lg mt-2 w-48">
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort("priceDesc")}
                            >
                                Giá cao đến thấp
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort("priceAsc")}
                            >
                                Giá thấp đến cao
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort("sqftDesc")}
                            >
                                Diện tích cao đến thấp
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort("sqftAsc")}
                            >
                                Diện tích thấp đến cao
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

           
            {properties.length === 0 ? (
                <div className="w-4/5 mx-auto mt-6 text-center bg-green-100 border border-green-300 p-6 rounded-lg">
                    <h5 className="font-bold">
                        Hiện tại chưa có bài đăng về địa điểm này.
                    </h5>
                    <a
                        href="/"
                        className="inline-block mt-4 px-6 py-2 border border-gray-600 rounded-lg"
                    >
                        Quay lại trang chủ
                    </a>
                </div>
            ) : (
                <div className="w-4/5 mx-auto">
                    {properties.map((property) => (
                        <a
                            key={property.propertyId}
                            href={`/listing/listing-info/${property.propertyId}`}
                            className="block my-6 rounded-lg shadow bg-gray-100 overflow-hidden"
                        >
                            <div
                                className={`absolute top-6 left-24 px-2 py-1 text-xs text-white rounded-lg ${property.postInformation.typePost === "VIP Kim Cương"
                                    ? "bg-red-600"
                                    : "bg-gray-800"
                                    }`}
                            >
                                {property.postInformation.typePost}
                            </div>

                            <div className="flex justify-center">
                                <img
                                    className="w-[630px] h-[250px] object-cover rounded-lg"
                                    src={property.listImages[0]?.imageUrl}
                                    alt=""
                                />
                                <div className="flex flex-col ml-2">
                                    <img
                                        className="w-[230px] h-[124px] object-cover rounded-lg mb-2"
                                        src={property.listImages[1]?.imageUrl}
                                        alt=""
                                    />
                                    <img
                                        className="w-[230px] h-[124px] object-cover rounded-lg"
                                        src={property.listImages[2]?.imageUrl}
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="px-4 py-2">
                                <h6 className="uppercase font-semibold text-gray-800 truncate">
                                    {property.propertyTitle}
                                </h6>
                                <p className="text-sm text-gray-600">
                                    {property.address.fullAddress}
                                </p>
                            </div>

                            <div className="grid grid-cols-6 gap-2 px-4 py-2 text-gray-800">
                                <div className="col-span-2 font-bold text-red-600">
                                    {property.propertyTypeTransaction === "rent"
                                        ? `${property.propertyPrice / 1_000_000} triệu/tháng`
                                        : property.propertyPrice > 1_000_000_000
                                            ? `${property.propertyPrice / 1_000_000_000} tỷ`
                                            : `${property.propertyPrice / 1_000_000} triệu`}
                                </div>
                                <div className="col-span-1 font-bold text-red-600">
                                    {property.squareMeters} m²
                                </div>
                                <div className="flex items-center col-span-1">
                                    🛏 {property.bedrooms}
                                </div>
                                <div className="flex items-center col-span-1">
                                    🛁 {property.bathrooms}
                                </div>
                            </div>

                            <p className="px-4 text-sm text-gray-700 truncate">
                                {property.propertyDescription}
                            </p>

                            <hr className="my-2" />

                            <div className="flex justify-between items-center px-4 pb-4">
                                <div className="flex items-center">
                                    <img
                                        className="w-8 h-8 rounded-full mr-2"
                                        src="https://file4.batdongsan.com.vn/resize/200x200/2024/07/30/20240730153731-b584.jpg"
                                        alt="avatar"
                                    />
                                    <div>
                                        <p className="text-xs font-bold">
                                            {property.postInformation.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {property.postInformation.datePost}
                                        </p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                                    📞 Liên hệ: {property.postInformation.phone}
                                </button>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
