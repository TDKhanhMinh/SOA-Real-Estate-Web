import { useState } from "react";
import Button from "./Button";

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h5 className="font-bold text-lg">Chỉnh sửa thông tin</h5>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block font-semibold mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="Button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
