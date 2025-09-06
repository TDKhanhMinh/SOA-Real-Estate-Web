import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { FaKey, FaTag } from "react-icons/fa";
import Button from "../components/Button";
import MapAutoComplete from "../components/MapAutoComplete";

export default function Post() {
    const [form, setForm] = useState({
        city: "",
        district: "",
        ward: "",
        addressDetail: "",
        propertyType: "",
        area: "",
        price: "",
        paper: "",
        interior: "",
        floors: "",
        bedrooms: "",
        bathrooms: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        titleDescription: "",
        description: "",
        images: [],

    });

    const [previewImages, setPreviewImages] = useState([]);
    const [isSelected, setIsSelected] = useState("")
    const [location, setLocation] = useState(null);
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const fileArray = Array.from(files);
            setForm((prev) => ({ ...prev, [name]: fileArray }));

            const previewArray = fileArray.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewImages(previewArray);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...form.images];
        newImages.splice(index, 1);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);

        setForm((prev) => ({ ...prev, images: newImages, city: location }));
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data:", form);
        alert("Đã gửi dữ liệu, xem console!");
    };

    return (
        <div className="max-w-5xl mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-start mb-6">
                    Tạo bài đăng
                </h2>
                <Button className="border rounded-3xl hover:bg-gray-400" to={"/"}>Thoát</Button>
            </div>

            <section className="border rounded-3xl p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold mb-4">Nhu cầu</h3>
                <div className="grid grid-cols-2 space-x-4">
                    <div className={`border h-20 rounded-xl flex items-center hover:bg-gray-300 ${isSelected === "sell" ? "border-gray-900 bg-gray-200" : ""}`} onClick={() => (setIsSelected("sell"))} >
                        <FaTag className="ml-4" />
                        <span className="mx-2">Bán</span>
                    </div>
                    <div className={`border h-20 rounded-xl flex items-center hover:bg-gray-300 ${isSelected === "rent" ? "border-gray-900 bg-gray-200" : ""}`} onClick={() => (setIsSelected("rent"))}>
                        <FaKey className="ml-4" />
                        <span className="mx-2">Cho thuê</span>
                    </div>
                </div>
            </section>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/*  Địa chỉ */}
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4"> Địa chỉ bất động sản</h3>
                    <MapAutoComplete onSelect={(data) => setLocation(data)} />
                </section>

                {/*  Thông tin BĐS */}
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
                            name="paper"
                            value={form.paper}
                            onChange={handleChange}
                            className="border p-2 rounded-3xl w-full"
                        >
                            <option value="">-- Giấy tờ pháp lý --</option>
                            <option>Sổ đỏ/Sổ hồng</option>
                            <option>Hợp đồng mua bán</option>
                            <option>Đang chờ sổ</option>
                        </select>

                        <select
                            name="interior"
                            value={form.interior}
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
                                name="floors"
                                value={form.floors}
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
                            name="contactName"
                            value={form.contactName}
                            onChange={handleChange}
                            placeholder="Họ và tên"
                            className="border p-2 rounded-3xl w-full"
                            required
                        />
                        <input
                            type="tel"
                            name="contactPhone"
                            value={form.contactPhone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="border p-2 rounded-3xl w-full"
                            required
                        />
                        <input
                            type="email"
                            name="contactEmail"
                            value={form.contactEmail}
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
                            name="titleDescription"
                            value={form.titleDescription}
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
                {/*  Upload ảnh */}
                <section className="border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Hình ảnh bất động sản</h3>

                    {/* Upload zone */}
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

                    {/* Preview */}
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
                                    {/* nút xoá */}
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

                {/* Đăng tin */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        Đăng tin ngay
                    </button>
                </div>
            </form>
        </div>
    );
}
