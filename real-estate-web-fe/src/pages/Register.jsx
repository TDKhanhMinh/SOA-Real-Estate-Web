import { useState } from "react";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = {};
    if (!formData.fullName) errs.fullName = "Full name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.phone) errs.phone = "Phone is required";
    if (!formData.password) errs.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setError(errs);
    if (Object.keys(errs).length === 0) {
      setSuccess("Registration successful!");
      console.log("Form submitted:", formData);
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

        {/* Success / Error messages */}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded-full text-center mb-4">
            {success}
          </div>
        )}
        {Object.keys(error).length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded-full text-center mb-4">
            Please fill all fields
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Your Full Name
            </label>
            <TextInput
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.fullName && (
              <p className="text-red-500 text-sm">{error.fullName}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Phone</label>
            <TextInput
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-400"
            />
            {error.phone && (
              <p className="text-red-500 text-sm">{error.phone}</p>
            )}
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
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
