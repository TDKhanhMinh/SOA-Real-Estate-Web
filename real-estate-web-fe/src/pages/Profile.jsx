import { useEffect, useState } from "react";
import Button from "../components/Button";
import EditProfileModal from "../components/EditProfileModal";
import ImageUploadModal from "../components/UploadImageModal";
import { userService } from "../services/userService";
import { uploadService } from "../services/uploadService";

export default function Profile() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getProfile();
            console.log("Profile data return", data);
            setUser(data);
        } catch (error) {
            console.error("Lỗi khi tải profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data) => {
        console.log("Dữ liệu mới:", data);
        try {
            const updatedUser = await userService.updateProfile(data);
            setUser(updatedUser);
            setModalOpen(false);
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
        }
    };

    const handleSaveImage = async (files) => {
        console.log("Ảnh được chọn:", files);
        if (files.length > 0) {
            try {
                const file = files[0];
                const formData = new FormData();
                formData.append("file", file);
                setImageModalOpen(false);
                const updatedUserImage = await uploadService.uploadImage(formData);
                console.log("Image", updatedUserImage);
                const dataUpdate = {
                    name: user.name,
                    phone: user.phone,
                    avatarUrl: updatedUserImage.data
                }
                await userService.updateProfile(dataUpdate);
                await fetchProfile();
                window.location.reload(true);
            } catch (error) {
                console.error("Lỗi tải ảnh lên:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-500">Không thể tải dữ liệu người dùng.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 pb-10">
            <div className="relative w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4">
                <img
                    src="https://res.cloudinary.com/dsj6sba9f/image/upload/v1763018205/pngtree-exquisite-dark-blue-watercolor-background-premium-texture-with-unparalleled-high-resolution-image_13674889_vffe1g.png"
                    alt="cover"
                    className="w-full h-60 object-cover rounded"
                />


                <div className="flex items-end -mt-20 px-6">
                    <img
                        src={user.avatarUrl || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                        alt="profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="ml-4 mb-4">
                        <h4 className="text-2xl font-bold">{user.name}</h4>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-2xl">Thông tin cá nhân</div>
                        <Button onClick={() => setModalOpen(true)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Chỉnh sửa thông tin
                        </Button>
                    </div>
                    <div className="mt-2 space-y-2 text-base">
                        <p>
                            <span className="font-semibold text-base w-32 inline-block">Tên đầy đủ: </span>
                            {user.name}
                        </p>
                        <p>
                            <span className="font-semibold text-base w-32 inline-block">Email: </span>
                            {user.email}
                        </p>
                        <p>
                            <span className="font-semibold text-base w-32 inline-block">Số điện thoại: </span>
                            {user.phone || "(Chưa cập nhật)"}
                        </p>
                    </div>
                </div>

                <hr className="mx-6" />

                <div className="mt-6 p-6 flex justify-between items-center">
                    <div className="font-bold text-xl">Ảnh đại diện</div>
                    <Button onClick={() => setImageModalOpen(true)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                        Chỉnh sửa ảnh
                    </Button>
                </div>

                <hr className="mx-6" />

                <div className="mt-6 p-6 flex justify-between items-center">
                    <div className="font-bold text-xl">Đổi mật khẩu</div>
                    <Button to="/change-password" className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                        Chỉnh sửa
                    </Button>
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