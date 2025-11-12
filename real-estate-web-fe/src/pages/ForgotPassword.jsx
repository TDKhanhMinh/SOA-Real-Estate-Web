import { useState } from "react";
import { toast } from "react-toastify";
import { userService } from "../services/userService";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [form, setForm] = useState({ email: "" });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email) {
            setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
            return;
        }

        setLoading(true);
        try {
            await userService.forgotPassword({ email: form.email });
            setMessage({
                type: "success",
                text: "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.",
            });
            setForm({ email: "" });
            navigate("/otp-verification");

        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-blue-600 to-sky-400 px-4 py-10">
            <div className="max-w-3xl w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div
                        className="hidden md:block bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80')",
                            minHeight: "480px",
                        }}
                    />

                    <div className="p-8 md:p-10 text-white">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                Forgot Password?
                            </h1>
                            <p className="text-sm text-gray-200 mt-2">
                                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                            </p>
                        </div>

                        {message && (
                            <div
                                className={`p-3 mb-5 rounded-md text-sm font-medium transition-all duration-300 ${message.type === "success"
                                    ? "bg-emerald-500/80 text-white"
                                    : "bg-rose-500/80 text-white"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ email của bạn..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 transition-all duration-300 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lại"}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-white/20 pt-6 text-center space-y-2">
                            <a
                                href="/register"
                                className="text-sm text-gray-200 hover:text-white transition"
                            >
                                Tạo tài khoản mới
                            </a>
                            <br />
                            <a
                                href="/login"
                                className="text-sm text-gray-200 hover:text-white transition"
                            >
                                Đã có tài khoản? Đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
