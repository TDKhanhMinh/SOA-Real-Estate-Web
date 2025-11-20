import React, { useState, useEffect } from "react";
import { FaKey, FaTag, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import MapAutoComplete from "../components/MapAutoComplete";
import { uploadService } from "../services/uploadService";
import { listingService } from "../services/listingService ";

export default function EditPostModal({ isOpen, onClose, initialData, onSuccess }) {
    const [form, setForm] = useState({
        id: "",
        title: "",
        price: "",
        address: "",
        longitude: "",
        latitude: "",
        amenities: "",
        propertyTransactionType: "",
        legalPapers: "",
        description: "",
        floorNumber: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        imageUrls: [],
        name: "",
        phone: "",
        email: ""
    });

    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            console.log("initdata", initialData);
            setForm({
                ...initialData,
                price: initialData.price || "",
                area: initialData.area || "",
                floorNumber: initialData.floorNumber || "",
                bedrooms: initialData.bedrooms || "",
                bathrooms: initialData.bathrooms || "",
                name: initialData.realtorName || "",
                email: initialData.realtorEmail || "",
                phone: initialData.realtorPhone || "",
                propertyType: initialData.propertyType || ""
            });
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newPreviews]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const fileArray = Array.from(files);
            setNewFiles(prev => [...prev, ...fileArray]);

            const previewArray = fileArray.map((file) => URL.createObjectURL(file));
            setNewPreviews(prev => [...prev, ...previewArray]);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveOldImage = (index) => {
        const updatedImages = [...form.imageUrls];
        updatedImages.splice(index, 1);
        setForm(prev => ({ ...prev, imageUrls: updatedImages }));
    };

    const handleRemoveNewImage = (index) => {
        const updatedFiles = [...newFiles];
        updatedFiles.splice(index, 1);
        setNewFiles(updatedFiles);

        const updatedPreviews = [...newPreviews];
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedPreviews.splice(index, 1);
        setNewPreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.title.length < 10) {
            toast.error("Tiêu đề phải dài hơn 10 ký tự");
            return;
        }
        if (isLoading) return;

        setIsLoading(true);
        try {
            let uploadedUrls = [];

            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach((file) => {
                    formData.append("files", file);
                });
                const uploadResponse = await uploadService.uploadListImages(formData);
                uploadedUrls = uploadResponse.data;
            }

            const finalImageUrls = [...form.imageUrls, ...uploadedUrls];

            const finalPayload = {
                ...form,
                price: Number(form.price),
                area: Number(form.area),
                floorNumber: Number(form.floorNumber),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                longitude: Number(form.longitude),
                latitude: Number(form.latitude),
                imageUrls: finalImageUrls,
                id: Number(initialData.id)
            };

            console.log("Update Payload:", finalPayload);
            await listingService.updateListing(finalPayload.id, finalPayload);

            toast.success("Cập nhật bài đăng thành công");
            if (onSuccess) onSuccess();
            onClose();

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">


                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài đăng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>


                <div className="p-6 space-y-8">
                    <form id="edit-post-form" onSubmit={handleSubmit} className="space-y-8">


                        <section className="border rounded-2xl p-5 shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Nhu cầu</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`border h-16 rounded-xl flex items-center cursor-pointer transition-all ${form.propertyTransactionType === "SALE" ? "border-blue-600 bg-blue-50 text-blue-700" : "hover:bg-white bg-white"}`}
                                    onClick={() => setForm(prev => ({ ...prev, propertyTransactionType: "SALE" }))}
                                >
                                    <FaTag className="ml-6 mr-3" />
                                    <span className="font-medium">Bán</span>
                                </div>
                                <div
                                    className={`border h-16 rounded-xl flex items-center cursor-pointer transition-all ${form.propertyTransactionType === "RENT" ? "border-blue-600 bg-blue-50 text-blue-700" : "hover:bg-white bg-white"}`}
                                    onClick={() => setForm(prev => ({ ...prev, propertyTransactionType: "RENT" }))}
                                >
                                    <FaKey className="ml-6 mr-3" />
                                    <span className="font-medium">Cho thuê</span>
                                </div>
                            </div>
                        </section>


                        <section className="border rounded-2xl p-5 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Địa chỉ</h3>
                            <div className="mb-3">
                                <label className="block text-sm text-gray-500 mb-1">Địa chỉ hiện tại</label>
                                <input
                                    disabled
                                    value={form.address}
                                    className="w-full p-2 bg-gray-100 rounded border mb-3 text-gray-600"
                                />
                            </div>
                            <MapAutoComplete onSelect={(data) => {
                                setForm(prev => ({
                                    ...prev,
                                    address: data.description,
                                    longitude: data.longitude,
                                    latitude: data.latitude
                                }));
                            }} />
                        </section>


                        <section className="border rounded-2xl p-5 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin bất động sản</h3>
                            <div className="grid gap-4">
                                <select
                                    name="propertyType"
                                    value={form.propertyType}
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-200 outline-none"
                                    required
                                >
                                    <option value="">-- Loại BĐS --</option>
                                    <option >Căn hộ chung cư</option>
                                    <option >Nhà riêng</option>
                                    <option >Biệt thự</option>
                                    <option >Nhà mặt phố</option>
                                </select>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="area" className="block text-sm text-gray-500 mb-1">Diện tích (m²)</label>
                                        <input type="number" name="area" id="area" value={form.area} onChange={handleChange} placeholder="Diện tích" className="w-full border p-3 rounded-xl" required />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="price" className="block text-sm text-gray-500 mb-1">Giá (VNĐ)</label>
                                        <input type="number" name="price" id="price" value={form.price} onChange={handleChange} placeholder="Giá" className="w-full border p-3 rounded-xl" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col">
                                        <label htmlFor="floorNumber" className="block text-sm text-gray-500 mb-1">Số tầng</label>
                                        <input type="number" name="floorNumber" id="floorNumber" value={form.floorNumber} onChange={handleChange} placeholder="Số tầng" className="border p-3 rounded-xl" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="bedrooms" className="block text-sm text-gray-500 mb-1">Phòng ngủ</label>
                                        <input type="number" name="bedrooms" id="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="Phòng ngủ" className="border p-3 rounded-xl" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="bathrooms" className="block text-sm text-gray-500 mb-1">Phòng tắm</label>
                                        <input type="number" name="bathrooms" id="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Phòng tắm" className="border p-3 rounded-xl" />
                                    </div>
                                </div>

                                <select name="legalPapers" value={form.legalPapers} onChange={handleChange} className="border p-3 rounded-xl w-full">
                                    <option value="">-- Giấy tờ pháp lý --</option>
                                    <option>Sổ đỏ/Sổ hồng</option>
                                    <option>Hợp đồng mua bán</option>
                                    <option>Đang chờ sổ</option>
                                </select>

                                <select name="amenities" value={form.amenities} onChange={handleChange} className="border p-3 rounded-xl w-full">
                                    <option value="">-- Nội thất --</option>
                                    <option>Đầy đủ</option>
                                    <option>Cơ bản</option>
                                    <option>Không có</option>
                                </select>
                            </div>
                        </section>


                        <section className="border rounded-2xl p-5 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Nội dung</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Tiêu đề bài đăng"
                                    className="border p-3 rounded-xl w-full font-medium"
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Mô tả chi tiết..."
                                    className="border p-3 rounded-xl w-full"
                                    required
                                ></textarea>
                            </div>
                        </section>


                        <section className="border rounded-2xl p-5 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Hình ảnh</h3>


                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                                <p className="text-sm text-blue-600 font-medium">+ Thêm ảnh mới</p>
                                <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="hidden" />
                            </label>

                            <div className="mt-6">

                                {form.imageUrls?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Ảnh hiện tại:</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {form.imageUrls.map((src, i) => (
                                                <div key={`old-${i}`} className="relative group rounded-lg overflow-hidden aspect-square border">
                                                    <img src={src} alt="Old" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => handleRemoveOldImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                                                        <FaTimes size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {newPreviews.length > 0 && (
                                    <div>
                                        <p className="text-xs text-green-600 mb-2 font-bold uppercase">Ảnh mới thêm:</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {newPreviews.map((src, i) => (
                                                <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden aspect-square border-2 border-green-400">
                                                    <img src={src} alt="New" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => handleRemoveNewImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                                                        <FaTimes size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>


                        <section className="border rounded-2xl p-5 shadow-sm bg-gray-50">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin liên hệ</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Tên liên hệ" className="border p-3 rounded-xl" required />
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-3 rounded-xl" required />
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-3 rounded-xl sm:col-span-2" required />
                            </div>
                        </section>

                    </form>
                </div>


                <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        form="edit-post-form"
                        disabled={isLoading}
                        className={`px-6 py-2.5 rounded-full text-white font-medium transition flex items-center justify-center min-w-[140px]
                            ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </>
                        ) : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}