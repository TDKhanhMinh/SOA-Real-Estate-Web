import { useState } from "react";
import Button from "../components/Button";
import EditProfileModal from "../components/EditProfileModal";
import ImageUploadModal from "../components/UploadImageModal";

export default function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [user, setUser] = useState({
        fullName: "Nguyễn Trường Nam",
        email: "nam@gmail.com",
        phone: "0901234567",
        imageUrl:
            "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg",
    });
    const handleSave = (data) => {
        console.log("Dữ liệu mới:", data);
        setUser(data);
    };
    const handleSaveImage = (files) => {
        console.log("Ảnh được chọn:", files);
        if (files.length > 0) {
            setUser(preUser => ({ ...preUser, imageUrl: URL.createObjectURL(files[0]) }));
            setImageModalOpen(false);
        }
    };
    return (
        <div className="w-full min-h-screen bg-gray-100 pb-10">

            <div className="relative w-3/4 mx-auto bg-white shadow-md rounded-lg p-4">
                <img
                    src="https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-exquisite-dark-blue-watercolor-background-premium-texture-with-unparalleled-high-resolution-image_13674889.png"
                    alt="cover"
                    className="w-full h-60 object-cover rounded"
                />

                <div className="flex justify-between items-end ">
                    <img
                        src={user.imageUrl || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                        alt="profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-white -mt-16"
                    />
                    <div className="text-right">
                        <h4 className="text-xl font-bold">{user.fullName}</h4>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="flex justify-between">
                        <div className="font-bold text-2xl">Thông tin cá nhân</div>
                        <Button onClick={() => setModalOpen(true)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Chỉnh sửa thông tin
                        </Button>
                    </div>
                    <div className="mt-2 space-y-2 text-sm">
                        <p>
                            <span className="font-semibold text-base ">Tên đầy đủ: </span>
                            {user.fullName}
                        </p>
                        <p>
                            <span className="font-semibold text-base ">Email: </span>
                            {user.email}
                        </p>
                        <p>
                            <span className="font-semibold text-base ">Số điện thoại: </span>
                            {user.phone}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <div className="font-bold text-xl">Đổi mật khẩu</div>
                    <Button to="/change-password" className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                        Chỉnh sửa
                    </Button>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="flex justify-between">
                        <div className="font-bold text-xl">Ảnh đại diện</div>
                        <Button onClick={() => setImageModalOpen(true)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Chỉnh sửa ảnh
                        </Button>
                    </div>
                </div>
            </div>
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initialData={user} />
            <ImageUploadModal
                isOpen={isImageModalOpen}
                onClose={() => setImageModalOpen(false)}
                onSave={handleSaveImage}
            />
        </div>
    );
}
