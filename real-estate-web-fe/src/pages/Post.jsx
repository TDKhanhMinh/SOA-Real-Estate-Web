import React, { useState } from "react";
import { FaKey, FaTag } from "react-icons/fa";
import Button from "../components/Button";
import MapAutoComplete from "../components/MapAutoComplete";
import { toast } from "react-toastify";
import { uploadService } from './../services/uploadService';
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { listingService } from "../services/listingService ";

export default function Post() {
    const [form, setForm] = useState({
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSelected, setIsSelected] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);

            const previewArray = fileArray.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewImages(previewArray);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (form.title.length < 10) {
            toast.error("Tiêu đề phải dài hơn 10 ký tự");
            return;
        }
        if (isLoading) return;
        setIsLoading(true)
        try {
            let imageUrls = [];
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach((file) => {
                    formData.append("files", file);
                });

                const uploadResponse = await uploadService.uploadListImages(formData);
                imageUrls = uploadResponse.data;
            }
            const finalPayload = {
                ...form,
                price: Number(form.price),
                area: Number(form.area),
                floorNumber: Number(form.floorNumber),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                longitude: Number(form.longitude),
                latitude: Number(form.latitude),
                propertyTransactionType: isSelected,
                imageUrls: imageUrls
            };

            console.log("Payload:", finalPayload);
            await listingService.createListing(finalPayload);
            toast.success("Thêm bài đăng thành công");
            navigate('/account/listing');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra";

            const msgMap = {
                "TITLE_INVALID": "Tiêu đề quá ngắn (tối thiểu 10 ký tự)",
                "PHONE_INVALID": "Số điện thoại không hợp lệ",
                "EMAIL_INVALID": "Email không hợp lệ"
            };

            toast.error(msgMap[errorMsg] || errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-start mb-6">
                    Tạo bài đăng
                </h2>
                <Button className="border rounded-3xl hover:bg-gray-400" onClick={() => setIsModalOpen(true)}>Thoát</Button>
            </div>

            <section className="border rounded-3xl p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold mb-4">Nhu cầu</h3>
                <div className="grid grid-cols-2 space-x-4">
                    <div className={`border h-20 rounded-xl flex items-center hover:bg-gray-300 ${isSelected === "SALE" ? "border-gray-900 bg-gray-200" : ""}`} onClick={() => (setIsSelected("SALE"))} >
                        <FaTag className="ml-4" />
                        <span className="mx-2">Bán</span>
                    </div>
                    <div className={`border h-20 rounded-xl flex items-center hover:bg-gray-300 ${isSelected === "RENT" ? "border-gray-900 bg-gray-200" : ""}`} onClick={() => (setIsSelected("RENT"))}>
                        <FaKey className="ml-4" />
                        <span className="mx-2">Cho thuê</span>
                    </div>
                </div>
            </section>
            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4"> Địa chỉ bất động sản</h3>
                    <MapAutoComplete onSelect={(data) => {
                        setForm(pre => ({
                            ...pre,
                            address: data.description,
                            longitude: data.longitude,
                            latitude: data.latitude
                        }));
                    }} />
                </section>

                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Thông tin bất động sản</h3>
                    <div className="space-y-3">
                        <select
                            name="propertyType"
                            value={form.propertyType}
                            onChange={handleChange}
                            className="border p-2 rounded-3xl w-full"
                            required
                        >
                            <option value="">-- Loại BĐS --</option>
                            <option>Căn hộ chung cư</option>
                            <option>Nhà riêng</option>
                            <option>Biệt thự</option>
                            <option>Nhà mặt phố</option>
                            <option>Nhà trọ/Phòng trọ</option>
                        </select>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="area"
                                value={form.area}
                                onChange={handleChange}
                                placeholder="Diện tích"
                                className="rounded-3xl border p-2 rounded-md flex-1"
                                required
                            />
                            <span className="px-3 py-2 bg-gray-200 rounded-md">m²</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Giá"
                                className="rounded-3xl border p-2 rounded-md flex-1"
                                required
                            />
                            <span className="px-3 py-2 bg-gray-200 rounded-md">VNĐ</span>
                        </div>

                        <select
                            name="legalPapers"
                            value={form.legalPapers}
                            onChange={handleChange}
                            className="border p-2 rounded-3xl w-full"
                        >
                            <option value="">-- Giấy tờ pháp lý --</option>
                            <option>Sổ đỏ/Sổ hồng</option>
                            <option>Hợp đồng mua bán</option>
                            <option>Đang chờ sổ</option>
                        </select>

                        <select
                            name="amenities"
                            value={form.amenities}
                            onChange={handleChange}
                            className="border p-2 rounded-3xl w-full"
                        >
                            <option value="">-- Nội thất --</option>
                            <option>Đầy đủ</option>
                            <option>Cơ bản</option>
                            <option>Không có</option>
                        </select>

                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                name="floorNumber"
                                value={form.floorNumber}
                                onChange={handleChange}
                                placeholder="Số tầng"
                                className="border p-2 rounded-md rounded-3xl"
                            />
                            <input
                                type="number"
                                name="bedrooms"
                                value={form.bedrooms}
                                onChange={handleChange}
                                placeholder="Phòng ngủ"
                                className="border p-2 rounded-md rounded-3xl"
                            />
                            <input
                                type="number"
                                name="bathrooms"
                                value={form.bathrooms}
                                onChange={handleChange}
                                placeholder="Phòng tắm"
                                className="border p-2 rounded-md rounded-3xl"
                            />
                        </div>
                    </div>
                </section>

                {/* Liên hệ */}
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
                    <div className="space-y-3">

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tên liên hệ"
                            className="border p-2 rounded-3xl w-full"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="border p-2 rounded-3xl w-full"
                            required
                        /><input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="border p-2 rounded-3xl w-full"
                            required
                        />
                    </div>
                </section>

                {/* Mô tả */}
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Nội dung tiêu đề & mô tả</h3>
                    <div className="space-y-3">

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Mô tả ngắn gọn về loại hình bất động sản"
                            className="border p-2 rounded-3xl w-full"
                            required
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Mô tả chi tiết..."
                            className="border p-2 rounded-3xl w-full"
                            required
                        ></textarea>
                    </div>
                </section>
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Hình ảnh bất động sản</h3>

                    <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 010 10h-1m-4 4v-8m0 0L9 13m3-3l3 3"
                            ></path>
                        </svg>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Chọn ảnh</span> hoặc kéo & thả tại đây
                        </p>
                        <input
                            id="images"
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>

                    {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {previewImages.map((src, i) => (
                                <div
                                    key={i}
                                    className="relative group rounded-lg overflow-hidden shadow-md"
                                >
                                    <img
                                        src={src}
                                        alt={`preview-${i}`}
                                        className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-full text-white font-medium transition-all flex items-center justify-center ml-auto 
            ${isLoading
                                ? "bg-blue-400 cursor-not-allowed opacity-70"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            "Đăng tin ngay"
                        )}
                    </button>
                </div>
            </form>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                title="Xác nhận thoát"
                message="Nếu bạn thoát thì bài đăng của bạn sẽ lưu ở bản nháp?"
            />
        </div>

    );
}
