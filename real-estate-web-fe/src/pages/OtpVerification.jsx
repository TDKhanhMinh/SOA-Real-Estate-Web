import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { userService } from "../services/userService";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpVerification() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    const handleChange = (value, index) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value.slice(-1);
            setOtp(newOtp);

            if (value && index < 5) {
                inputsRef.current[index + 1].focus();
            }
        }
    };
    const handleResentOtp = async () => {
        setLoading(true);
        try {
            await userService.forgotPassword({ email: email });
            toast.success("Mã OTP mới đã được gửi đến email của bạn.");
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== 6) {
            setMessage({ type: "error", text: "Vui lòng nhập đầy đủ 6 số." });
            return;
        }

        setLoading(true);
        try {
            await userService.verifyOTP({ code, email });
            toast.success("Xác minh OTP thành công! Bạn có thể đặt lại mật khẩu bây giờ.");
            navigate("/reset-password", { state: { email: email, otp: otp.join("") } });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-blue-600 to-sky-400 px-4 py-10">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 text-center text-white">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/20 p-3 rounded-full">
                        <ShieldCheck size={40} className="text-sky-300" />
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold mb-2">Xác minh OTP</h1>
                <p className="text-gray-200 text-sm mb-6">
                    Nhập mã gồm 6 chữ số được gửi đến email của bạn.
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2 sm:gap-3">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputsRef.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 transition-all duration-300 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Đang xác minh..." : "Xác minh mã OTP"}
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-200">
                    Không nhận được mã?{" "}
                    <button
                        type="button"
                        onClick={handleResentOtp}
                        className="text-white font-semibold hover:underline"
                    >
                        Gửi lại
                    </button>
                </div>
            </div>
        </div>
    );
}
