import { useState } from "react";
import Button from './Button';


export default function UploadImageModal({ isOpen, onClose, onSave }) {
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        previewFiles(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        previewFiles(files);
    };

    const previewFiles = (files) => {
        const previews = files.map((file) => {
            return { file, url: URL.createObjectURL(file) };
        });
        setImages((prev) => [...prev, ...previews]);
    };

    const handleSave = () => {
        onSave(images.map((img) => img.file));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center border-b px-4 py-3">
                    <h5 className="font-bold text-lg">Chỉnh sửa ảnh đại diện</h5>
                    <Button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        &times;
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    <h5 className="font-semibold">Hình ảnh</h5>

                    <div className="flex flex-wrap gap-3">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24">
                                <img
                                    src={img.url}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-lg shadow"
                                />
                                <Button
                                    onClick={() =>
                                        setImages((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
                    >
                        <p className="text-gray-600">Kéo thả ảnh vào đây <br /> hoặc</p>
                        <label className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                            Thêm ảnh từ thiết bị
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400"
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
}
