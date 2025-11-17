import { useState } from "react";
import { toast } from "react-toastify";
import { Lock, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";

export default function ResetPassword() {
    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const { state } = useLocation();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const email = state?.email;
    const otp = state?.otp
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.newPassword || !form.confirmPassword) {
            setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
            return;
        }
        if (form.newPassword.length < 6) {
            setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự." });
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu xác nhận không trùng khớp." });
            return;
        }

        setLoading(true);
        try {
            await userService.resetPassword({
                newPassword: form.newPassword,
                email: email,
                otp: otp
            });
            toast.success("Bạn đã cập nhật mật khẩu thành công");
            navigate("/login")
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-blue-600 to-sky-400 px-4 py-10">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 text-white text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/20 p-3 rounded-full">
                        <Lock size={40} className="text-sky-300" />
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold mb-2">Cập nhật mật khẩu mới</h1>
                <p className="text-sm text-gray-200 mb-6">
                    Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại.
                </p>

                {message && (
                    <div
                        className={`p-3 mb-5 rounded-md text-sm font-medium transition-all ${message.type === "success"
                            ? "bg-emerald-500/80"
                            : "bg-rose-500/80"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div>
                        <label className="block text-gray-200 text-sm mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-200 text-sm mb-1">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 transition-all duration-300 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-200">
                    Quay lại{" "}
                    <a
                        href="/login"
                        className="text-white font-semibold hover:underline"
                    >
                        trang đăng nhập
                    </a>
                </div>
            </div>
        </div>
    );
}
