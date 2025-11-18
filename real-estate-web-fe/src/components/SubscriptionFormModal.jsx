import React, { useState, useMemo } from 'react';
import { HiX, HiTag, HiCurrencyDollar, HiClock, HiDocument, HiChartBar, HiStar, HiCalendar } from 'react-icons/hi';

const initialFormData = {
    name: '',
    price: '',
    duration: '',
    description: '',
    maxPost: '',
    priority: '',
    postExpiryDays: '',
};

const InputField = ({ name, label, type = 'text', required = false, icon: Icon, formData, errors, handleChange, ...rest }) => (
    <div className="flex flex-col group">
        <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm text-sm 
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    hover:border-gray-400
                    ${errors[name]
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white'}`}
                {...rest}
            />
            {errors[name] && (
                <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-red-600 animate-fade-in">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[name]}
                </div>
            )}
        </div>
    </div>
);


export function SubscriptionFormModal({ show, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const modalTitle = useMemo(() => {
        return initialData ? 'Chỉnh sửa Gói Subscription' : 'Thêm Gói Subscription Mới';
    }, [initialData]);

    React.useEffect(() => {
        if (show) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData(initialFormData);
            }
            setErrors({});
        }
    }, [show, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { name, price, duration, description, maxPost, priority, postExpiryDays } = formData;

        if (!name) {
            newErrors.name = "Tên gói không được để trống";
        } else if (name.length > 100) {
            newErrors.name = "Tên gói không được vượt quá 100 ký tự";
        }

        const priceNum = parseFloat(price);
        if (price === '' || price == null) {
            newErrors.price = "Giá không được để trống";
        } else if (isNaN(priceNum) || priceNum < 0) {
            newErrors.price = "Giá phải là số dương hoặc bằng 0";
        }

        const durationNum = parseInt(duration, 10);
        if (duration === '' || duration == null) {
            newErrors.duration = "Thời hạn không được để trống";
        } else if (isNaN(durationNum) || durationNum <= 0) {
            newErrors.duration = "Thời hạn (số ngày) phải là số dương";
        }

        if (description && description.length > 500) {
            newErrors.description = "Mô tả không được vượt quá 500 ký tự";
        }

        const maxPostNum = parseInt(maxPost, 10);
        if (maxPost === '' || maxPost == null) {
            newErrors.maxPost = "Số lượng bài đăng tối đa không được để trống";
        } else if (isNaN(maxPostNum) || maxPostNum < 1) {
            newErrors.maxPost = "Số lượng bài đăng tối đa phải ít nhất là 1";
        }

        const priorityNum = parseInt(priority, 10);
        if (priority === '' || priority == null) {
            newErrors.priority = "Độ ưu tiên không được để trống";
        } else if (isNaN(priorityNum) || priorityNum <= 0) {
            newErrors.priority = "Độ ưu tiên phải là số dương";
        }

        const postExpiryDaysNum = parseInt(postExpiryDays, 10);
        if (postExpiryDays === '' || postExpiryDays == null) {
            newErrors.postExpiryDays = "Số ngày hết hạn bài đăng không được để trống";
        } else if (isNaN(postExpiryDaysNum) || postExpiryDaysNum <= 0) {
            newErrors.postExpiryDays = "Số ngày hết hạn bài đăng phải là số dương";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
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


    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{modalTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">Điền thông tin chi tiết gói subscription</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200 hover:rotate-90"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                <h4 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    name="name"
                                    label="Tên gói"
                                    icon={HiTag}
                                    required
                                    placeholder="VD: Premium, Basic, Enterprise"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />

                                <InputField
                                    name="price"
                                    label="Giá (VND)"
                                    icon={HiCurrencyDollar}
                                    type="number"
                                    step="1000"
                                    min="0"
                                    required
                                    placeholder="VD: 299000"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <HiDocument className="w-4 h-4 text-gray-500" />
                                    Mô tả
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả chi tiết về gói subscription..."
                                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm text-sm
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-offset-1
                                        hover:border-gray-400 resize-none
                                        ${errors.description
                                            ? 'border-red-400 focus:ring-red-400 bg-red-50'
                                            : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white'}`}
                                ></textarea>
                                {errors.description && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                                <h4 className="text-lg font-semibold text-gray-800">Cấu hình gói</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    name="duration"
                                    label="Thời hạn (ngày)"
                                    icon={HiClock}
                                    type="number"
                                    step="1"
                                    min="1"
                                    required
                                    placeholder="VD: 30"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />

                                <InputField
                                    name="maxPost"
                                    label="Số bài đăng tối đa"
                                    icon={HiChartBar}
                                    type="number"
                                    step="1"
                                    min="1"
                                    required
                                    placeholder="VD: 20"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />

                                <InputField
                                    name="priority"
                                    label="Độ ưu tiên"
                                    icon={HiStar}
                                    type="number"
                                    step="1"
                                    min="1"
                                    required
                                    placeholder="VD: 5"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />

                                <InputField
                                    name="postExpiryDays"
                                    label="Số ngày hết hạn bài đăng"
                                    icon={HiCalendar}
                                    type="number"
                                    step="1"
                                    min="1"
                                    required
                                    placeholder="VD: 30"
                                    formData={formData}
                                    errors={errors}
                                    handleChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <p className="text-xs text-gray-500">
                        <span className="text-red-500">*</span> Trường bắt buộc
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}