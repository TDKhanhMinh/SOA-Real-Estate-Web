import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { PropertyListingCard } from "../components/PropertyListingCard";

export default function SearchResult() {
    const location = useLocation();
    const initialProperties = location.state?.content || [];

    const [sortOption, setSortOption] = useState("default");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [sortedProperties, setSortedProperties] = useState(initialProperties);

    useEffect(() => {
        setSortedProperties(initialProperties);
    }, [location.state]);
    const getSortText = () => {
        switch (sortOption) {
            case "priceDesc":
                return "Giá cao → thấp";
            case "priceAsc":
                return "Giá thấp → cao";
            case "sqftDesc":
                return "Diện tích cao → thấp";
            case "sqftAsc":
                return "Diện tích thấp → cao";
            default:
                return "Thông thường";
        }
    };

    const handleSort = (option) => {
        setSortOption(option);
        setIsDropdownOpen(false);

        const sortedArray = [...sortedProperties];

        switch (option) {
            case "priceDesc":
                sortedArray.sort((a, b) => b.price - a.price);
                break;
            case "priceAsc":
                sortedArray.sort((a, b) => a.price - b.price);
                break;
            case "sqftDesc":
                sortedArray.sort((a, b) => b.area - a.area);
                break;
            case "sqftAsc":
                sortedArray.sort((a, b) => a.area - b.area);
                break;
            case "default":
                setSortedProperties(initialProperties);
                return;
            default:
                break;
        }

        setSortedProperties(sortedArray);
    };

    return (
        <div className="container mx-auto mt-40">

            <div className="flex justify-center py-6 border-b border-gray-200">
                <div className="flex justify-between w-4/5 items-center">
                    <h4 className="font-bold text-xl text-gray-800">
                        Mua bán và cho thuê nhà trên toàn quốc ({initialProperties.length} kết quả)
                    </h4>

                    <div className="relative">
                        <button
                            className="w-48 rounded-lg flex justify-between items-center bg-white border border-gray-300 hover:border-blue-500 transition px-4 py-2 shadow-sm"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>
                                {getSortText()}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M3.2 5h9.6L8 10.5z" />
                            </svg>
                        </button>


                        {isDropdownOpen && (
                            <ul className="absolute right-0 z-10 bg-white shadow-xl rounded-lg mt-2 w-48 border border-gray-200 divide-y divide-gray-100">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSort("default")}
                                >
                                    Thông thường
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSort("priceDesc")}
                                >
                                    Giá cao → thấp
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSort("priceAsc")}
                                >
                                    Giá thấp → cao
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSort("sqftDesc")}
                                >
                                    Diện tích cao → thấp
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSort("sqftAsc")}
                                >
                                    Diện tích thấp → cao
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>


            {sortedProperties.length === 0 ? (
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

                    {sortedProperties.map((property) => (
                        <PropertyListingCard property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}