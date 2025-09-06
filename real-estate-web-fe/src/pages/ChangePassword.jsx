import { useState } from "react";
import Button from "../components/Button";

export default function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu mới và xác nhận không khớp." });
            return;
        }

        // TODO: call API change password
        console.log("Submitted form:", form);
        setMessage({ type: "success", text: "Thay đổi mật khẩu thành công!" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-800 px-4">
            <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div
                        className="hidden md:block bg-cover bg-center rounded-l-2xl"
                        style={{
                            backgroundImage:
                                "url('https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-exquisite-dark-blue-watercolor-background-premium-texture-with-unparalleled-high-resolution-image_13674889.png')",
                            minHeight: "450px",
                        }}
                    />

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-white">Change Password</h1>
                        </div>

                        {message && (
                            <div
                                className={`p-3 mb-4 rounded text-sm ${message.type === "success"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white mb-1 font-semibold">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-1 font-semibold">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-1 font-semibold">
                                    Nhập lại mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                                >
                                    Lưu thay đổi
                                </Button>
                                <Button
                                    href="/account/profile"
                                    className="flex-1 text-center bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
                                >
                                    Hủy thay đổi
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
