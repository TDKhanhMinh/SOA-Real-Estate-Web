import { formatCurrency } from './../utils/formatCurrency';
import { formatDateTime } from './../utils/formatDateTime';
export const PropertyListingCard = ({ property }) => {

    const Icon = ({ path, label }) => (
        <div className="flex items-center text-gray-600 text-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
            <span className="font-medium">{label}</span>
        </div>
    );

    return (
        <a
            key={property.id}
            href={`/info/${property?.id}`}
            className="block my-6 rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
        >
            <div className="flex">


                <div className="w-3/5 relative overflow-hidden">

                    <img
                        className="w-full h-80 object-cover transition-transform duration-500 transform hover:scale-105"
                        src={property?.imageUrls[0]}
                        alt={property?.title}
                    />


                    <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full text-white ${property.propertyTransactionType === "SALE" ? "bg-red-600" : "bg-green-600"
                            }`}
                    >
                        {property.propertyTransactionType === "SALE" ? "BÁN" : "CHO THUÊ"}
                    </span>

                </div>


                <div className="w-2/5 flex flex-col p-5">


                    <div className="mb-3">
                        <h6 className="font-extrabold text-xl text-blue-700 hover:text-red-600 transition truncate" title={property?.title}>
                            {property?.title}
                        </h6>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span className="truncate">{property?.address}</span>
                        </p>
                    </div>

                    <hr className="my-2 border-gray-100" />


                    <div className="flex justify-between items-center mb-4">
                        <div className="font-extrabold text-2xl text-red-600">
                            {formatCurrency(property.price)}
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-y-2 mb-4">

                        <Icon
                            path="M17 14v6m-3-3h6M6 10h2m4 0h4m-4 5h1m-7 4h12a3 3 0 003-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v12a3 3 0 003 3z"
                            label={`${property.area} m²`}
                        />

                        <Icon
                            path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            label={`${property.bedrooms} PN`}
                        />

                        <Icon
                            path="M7 11.5V16m-3-1h10M17 6V11.5M17 16.5V21M17 11.5a3 3 0 00-6 0v5a3 3 0 006 0V11.5z"
                            label={`${property.bathrooms} PT`}
                        />

                        <Icon
                            path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            label={`Đăng lúc: ${formatDateTime(property.updatedAt)}`}
                        />
                    </div>

                    <hr className="my-2 border-gray-100" />


                    <p className="text-xs text-gray-700 line-clamp-2 mb-4">
                        {property.description}
                    </p>


                    <div className="mt-auto flex justify-between items-end">
                        <div className="flex items-center">
                            <img
                                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-100"
                                src="https://file4.batdongsan.com.vn/resize/200x200/2024/07/30/20240730153731-b584.jpg"
                                alt="avatar"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-800">
                                    {property.realtorName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Người đăng tin
                                </p>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-blue-700 transition duration-200 shadow-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.042 11.042 0 005.516 5.516l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            Liên hệ
                        </button>
                    </div>

                </div>
            </div>

            {property.imageUrls.length > 1 && (
                <div className="flex p-5 pt-0 gap-3 border-t border-gray-100 bg-gray-50">
                    {property.imageUrls.slice(1, 4).map((item, index) => (
                        <img
                            key={index}
                            className="w-1/3 h-16 object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity"
                            src={item}
                            alt={`Gallery image ${index + 2}`}
                        />
                    ))}
                    {property.imageUrls.length > 4 && (
                        <div className="w-1/3 h-16 bg-gray-300 rounded-md flex items-center justify-center text-gray-700 text-sm font-semibold">
                            + {property.imageUrls.length - 4} ảnh
                        </div>
                    )}
                </div>
            )}
        </a>
    );
};