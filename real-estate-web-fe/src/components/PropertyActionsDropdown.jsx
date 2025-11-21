import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const PropertyActionsDropdown = ({
    p,
    handlePostListing,
    handleSoldListing,
    handleRentedListing,
    handleEdit,
    handleHidden,
    handleSelectedDelete
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    // CSS chung cho các nút trong menu
    // *Đã thay đổi: Loại bỏ w-full khỏi actionButtonClass và thêm vào trong JSX button*
    const actionButtonBaseClass = "text-left px-4 py-2 text-xs font-semibold rounded-md transition duration-150";

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>

            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <FiMoreVertical className="w-4 h-4" />
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="p-1 flex flex-col space-y-1">

                        {p.status === "DRAFT" && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePostListing(p.id);
                                    setIsOpen(false);
                                }}
                                className={`${actionButtonBaseClass} w-full text-green-700 hover:bg-green-50`}
                                role="menuitem"
                            >
                                Gửi duyệt
                            </button>
                        )}

                        {p.status === "AVAILABLE" && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    p.propertyTransactionType === "SALE"
                                        ? handleSoldListing(p.id)
                                        : handleRentedListing(p.id);
                                    setIsOpen(false);
                                }}
                                className={`${actionButtonBaseClass} w-full text-green-700 hover:bg-green-50`}
                                role="menuitem"
                            >
                                {p.propertyTransactionType === "SALE" ? "Đã bán" : "Đã cho thuê"}
                            </button>
                        )}

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleEdit(p);
                                setIsOpen(false);
                            }}
                            className={`${actionButtonBaseClass} w-full text-blue-700 hover:bg-blue-50`}
                            role="menuitem"
                        >
                            Chỉnh sửa
                        </button>

                        {p.status === "SOLD" || p.status === "RENTED" &&
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleHidden(p.id);
                                    setIsOpen(false);
                                }}
                                className={`${actionButtonBaseClass} w-full ${p.status === "HIDDEN" ? "text-yellow-700 hover:bg-yellow-50" : "text-gray-700 hover:bg-gray-50"}`}
                                role="menuitem"
                            >
                                {p.status === "HIDDEN" ? "Hiển thị" : "Ẩn bài"}
                            </button>
                        }

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelectedDelete(p);
                                setIsOpen(false);
                            }}
                            className={`${actionButtonBaseClass} w-full text-red-600 hover:bg-red-50`}
                            role="menuitem"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyActionsDropdown;