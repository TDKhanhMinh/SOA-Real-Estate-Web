import { useState } from "react";

export default function ForgotPassword() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email || !form.password || !form.confirmPassword) {
            setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
            return;
        }
        if (form.password !== form.confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
            return;
        }

        // TODO: call API reset password
        console.log("Form submitted:", form);
        setMessage({ type: "success", text: "Đặt lại mật khẩu thành công!" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500 px-4">
            <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                    {/* Left side with background */}
                    <div className="hidden md:block bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-exquisite-dark-blue-watercolor-background-premium-texture-with-unparalleled-high-resolution-image_13674889.png')",
                            minHeight: "450px",
                        }}
                    />

                    {/* Right side form */}
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-white">
                                Forgot Your Password?
                            </h1>
                            <p className="text-sm text-gray-200 mt-2">
                                Chỉ cần nhập email và mật khẩu mới, chúng tôi sẽ gửi link xác nhận!
                            </p>
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
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter Email Address..."
                                className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter confirm password"
                                className="w-full px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>

                        <hr className="my-6 border-gray-300" />

                        <div className="text-center space-y-2">
                            <a href="/register" className="text-sm text-white hover:underline">
                                <strong>Create an Account!</strong>
                            </a>
                            <br />
                            <a href="/login" className="text-sm text-white hover:underline">
                                <strong>Already have an account? Login!</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
