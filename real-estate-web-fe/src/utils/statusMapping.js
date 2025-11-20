
// Định nghĩa map gồm Label (tên hiển thị) và Class màu sắc (Tailwind)
const STATUS_CONFIG = {
    PENDING_APPROVAL: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    AVAILABLE: {
        label: "Đang hiển thị",
        color: "bg-green-100 text-green-800 border-green-200"
    },
    SOLD: {
        label: "Đã bán",
        color: "bg-blue-800 text-white border-blue-900"
    },
    RENTED: {
        label: "Đã cho thuê",
        color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    EXPIRED: {
        label: "Hết hạn",
        color: "bg-gray-100 text-gray-600 border-gray-200"
    },
    REJECTED: {
        label: "Bị từ chối",
        color: "bg-red-100 text-red-800 border-red-200"
    },
    HIDDEN: {
        label: "Đã ẩn",
        color: "bg-gray-800 text-gray-200 border-gray-600"
    },
    DRAFT: {
        label: "Bản nháp",
        color: "bg-gray-200 text-gray-800 border-gray-300"
    }
};

export const getStatusLabel = (status) => {
    return STATUS_CONFIG[status]?.label || status || "Không xác định";
};