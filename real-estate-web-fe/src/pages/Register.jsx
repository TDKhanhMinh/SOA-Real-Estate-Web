import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!formData.name) errs.name = "Full name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.phone) errs.phone = "Phone number is required";
    if (!formData.password) errs.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setError(errs);
    if (Object.keys(errs).length === 0) {
      try {
        await authService.register(
          formData.name,
          formData.password,
          formData.email,
          formData.phone
        );
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }

    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center mt-20 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.vinhomescentralpark.co/wp-content/uploads/2021/04/landmark81-2.jpeg')",
      }}
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center mb-6 uppercase">
          Create an account
        </h3>


        {Object.keys(error).length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded-full text-center mb-4">
            Please fill all fields
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Your Full Name
            </label>
            <TextInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.name && (
              <p className="text-red-500 text-sm">{error.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Your Email
            </label>
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone
            </label>
            <TextInput
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.phone && (
              <p className="text-red-500 text-sm">{error.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password
            </label>
            <TextInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Repeat your password
            </label>
            <TextInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.confirmPassword && (
              <p className="text-red-500 text-sm">{error.confirmPassword}</p>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Have already an account?{" "}
            <Link
              to="/login"
              className="font-bold text-red-500 hover:underline"
            >
              Login here
            </Link>
          </p>

          <p className="text-xs text-center text-gray-500 mt-2">
            By continuing, you agree to our
          </p>
          <p className="text-xs text-center text-red-600">
            Terms of Use, Privacy Policy, Rules, Policies.
          </p>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-300 to-blue-400 hover:opacity-90 transition min-w-[200px]"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
