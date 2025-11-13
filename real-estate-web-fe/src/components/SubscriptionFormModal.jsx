import React, { useState, useMemo } from 'react';


const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- Dữ liệu giả lập ban đầu ---


// --- Dữ liệu form ban đầu ---
const initialFormData = {
    name: '',
    price: '',
    duration: '',
    description: '',
    maxPost: '',
    priority: '',
    postExpiryDays: '',
};


/**
 * Component Form Modal
 * @param {object} props
 * @param {boolean} props.show
 * @param {function} props.onClose
 * @param {function} props.onSubmit
 * @param {object | null} props.initialData
 */
export function SubscriptionFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    // Sử dụng useMemo để xác định tiêu đề modal
    const modalTitle = useMemo(() => {
        return initialData ? 'Chỉnh sửa Gói Subscription' : 'Thêm Gói Subscription Mới';
    }, [initialData]);

    // Cập nhật form data khi `initialData` thay đổi (khi mở modal để edit)
    React.useEffect(() => {
        if (show) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData(initialFormData);
            }
            setErrors({}); // Xóa lỗi cũ khi mở modal
        }
    }, [show, initialData]);

    /**
     * Xử lý thay đổi input
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    /**
     * Xác thực form
     * @returns {boolean} - true nếu form hợp lệ
     */
    const validateForm = () => {
        const newErrors = {};
        const { name, price, duration, description, maxPost, priority, postExpiryDays } = formData;

        // 1. Tên gói (name)
        if (!name) {
            newErrors.name = "Tên gói không được để trống";
        } else if (name.length > 100) {
            newErrors.name = "Tên gói không được vượt quá 100 ký tự";
        }

        // 2. Giá (price)
        const priceNum = parseFloat(price);
        if (price === '' || price == null) {
            newErrors.price = "Giá không được để trống";
        } else if (isNaN(priceNum) || priceNum < 0) {
            newErrors.price = "Giá phải là số dương hoặc bằng 0";
        }

        // 3. Thời hạn (duration)
        const durationNum = parseInt(duration, 10);
        if (duration === '' || duration == null) {
            newErrors.duration = "Thời hạn không được để trống";
        } else if (isNaN(durationNum) || durationNum <= 0) {
            newErrors.duration = "Thời hạn (số ngày) phải là số dương";
        }

        // 4. Mô tả (description)
        if (description && description.length > 500) {
            newErrors.description = "Mô tả không được vượt quá 500 ký tự";
        }

        // 5. Số lượng bài đăng (maxPost)
        const maxPostNum = parseInt(maxPost, 10);
        if (maxPost === '' || maxPost == null) {
            newErrors.maxPost = "Số lượng bài đăng tối đa không được để trống";
        } else if (isNaN(maxPostNum) || maxPostNum < 1) {
            newErrors.maxPost = "Số lượng bài đăng tối đa phải ít nhất là 1";
        }

        // 6. Độ ưu tiên (priority)
        const priorityNum = parseInt(priority, 10);
        if (priority === '' || priority == null) {
            newErrors.priority = "Độ ưu tiên không được để trống";
        } else if (isNaN(priorityNum) || priorityNum <= 0) {
            newErrors.priority = "Độ ưu tiên phải là số dương";
        }

        // 7. Số ngày hết hạn (postExpiryDays)
        const postExpiryDaysNum = parseInt(postExpiryDays, 10);
        if (postExpiryDays === '' || postExpiryDays == null) {
            newErrors.postExpiryDays = "Số ngày hết hạn bài đăng không được để trống";
        } else if (isNaN(postExpiryDaysNum) || postExpiryDaysNum <= 0) {
            newErrors.postExpiryDays = "Số ngày hết hạn bài đăng phải là số dương";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Xử lý submit form
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Chuyển đổi các giá trị số trước khi gửi
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration, 10),
                maxPost: parseInt(formData.maxPost, 10),
                priority: parseInt(formData.priority, 10),
                postExpiryDays: parseInt(formData.postExpiryDays, 10),
            };
            onSubmit(dataToSubmit);
        }
    };

    // Input field component để tái sử dụng
    const InputField = ({ name, label, type = 'text', required = false, ...rest }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                {...rest}
            />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
        </div>
    );

    if (!show) return null;

    return (
        // Lớp phủ (Overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">

            {/* Nội dung Modal */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 transform transition-all duration-300 scale-100">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Body - Form Fields */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Tên gói */}
                            <InputField name="name" label="Tên gói" required />

                            {/* Giá */}
                            <InputField name="price" label="Giá (USD)" type="number" step="0.01" min="0" required />

                            {/* Thời hạn */}
                            <InputField name="duration" label="Thời hạn (ngày)" type="number" step="1" min="1" required />

                            {/* Số lượng bài đăng tối đa */}
                            <InputField name="maxPost" label="Số bài đăng tối đa" type="number" step="1" min="1" required />

                            {/* Độ ưu tiên */}
                            <InputField name="priority" label="Độ ưu tiên" type="number" step="1" min="1" required />

                            {/* Số ngày hết hạn bài đăng */}
                            <InputField name="postExpiryDays" label="Số ngày hết hạn bài đăng" type="number" step="1" min="1" required />

                            {/* Mô tả (full width) */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                              ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                                ></textarea>
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                        </div>
                    </div>

                    {/* Footer - Actions */}
                    <div className="flex items-center justify-end p-5 border-t border-gray-200 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
