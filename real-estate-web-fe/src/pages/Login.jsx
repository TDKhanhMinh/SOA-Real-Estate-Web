import { Link, useNavigate } from "react-router-dom";
import TextInput from "./../components/TextInput";
import Button from "../components/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";


export default function Login() {
  const { login} = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Tài khoản không được để trống";

    if (!form.password) newErrors.password = "Mật khẩu không được để trống";
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login data:", form);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    await login(form.username, form.password)
    console.log("Login success with data:", form);
    navigate("/");

    toast.success("Đăng nhập thành công!")
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://farm2.staticflickr.com/1917/43285846020_2b950b8441_h.jpg')",
      }}
    >
      <div className="w-full max-w-4xl bg-white/90 shadow-lg rounded-xl flex flex-col md:flex-row">
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-100 to-blue-800 text-white rounded-l-xl p-8">
          <img
            src="https://res.cloudinary.com/dsj6sba9f/image/upload/v1745247841/c085ad076c442c8191e6b7f48ef59aad_k7izor.jpg"
            alt="Logo"
            className="w-28 h-30 rounded-xl border-2 border-white mb-4"
          />
          <h3 className="text-2xl font-bold text-center">
            Thỏ Bảy Màu Corporation
          </h3>
        </div>

        <div className="flex-1 p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            <strong>Login</strong>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <TextInput
                type="email"
                label="Email address"
                id="username"
                onChange={(e) => { setForm({ ...form, username: e.target.value }) }}
                className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <TextInput
                type="password"
                label="Password"
                id="password"
                onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                className="min-w-[150px] px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                <strong>Login</strong>
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
