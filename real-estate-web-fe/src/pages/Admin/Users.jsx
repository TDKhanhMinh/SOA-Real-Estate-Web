import { useState, useEffect } from "react";
import Button from './../../components/Button';
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import TextInput from "../../components/TextInput";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [notification, setNotification] = useState("");
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
                setShowForm(false);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    confirmPassword: "",
                });
                fetchUsers();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            }

        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        console.log("Users", await userService.getAllUsers());
        setUsers(await userService.getAllUsers());
    };


    const handleDeleteUser = (id) => {
        setUsers(users.filter((u) => u.id !== id));
        setNotification("Xóa người dùng thành công!");
    };

    return (
        <main className="w-full p-6">
            {notification && (
                <div className="fixed top-5 right-5 border border-green-700 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-lg">
                    {notification}
                </div>
            )}

            <div className="mb-4 ">
                {!showForm ? (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white font-medium"
                    >
                        Thêm người dùng
                    </Button>
                ) : (
                    <Button
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-white font-medium"
                    >
                        Hủy
                    </Button>
                )}
            </div>

            {showForm && (
                <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 mb-6">
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

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-300 to-blue-400 hover:opacity-90 transition min-w-[200px]"
                            >
                                Add new account
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {!showForm && (
                <div className="mt-6">
                    {users?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md">
                            <img
                                src="https://img.icons8.com/ios/100/000000/empty-box.png"
                                alt="empty"
                            />
                            <p className="text-gray-600 text-lg mt-4">There is no user</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-12 bg-white shadow p-4 font-bold">
                                <div>ID</div>
                                <div>Avatar</div>
                                <div className="col-span-2">Full Name</div>
                                <div className="col-span-2">Email</div>
                                <div className="col-span-2">Phone</div>
                                <div>Balance</div>
                                <div>Role</div>
                                <div className="col-span-2 text-center">Action</div>
                            </div>

                            {users?.map((u) => (
                                <div
                                    key={u.id}
                                    className="grid grid-cols-12 bg-white shadow mt-2 items-center p-4"
                                >
                                    <div>{u?.id}</div>
                                    <img
                                        src={
                                            u?.avatarUrl ||
                                            "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
                                        }
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="col-span-2">{u.name}</div>
                                    <div className="col-span-2">{u.email}</div>
                                    <div className="col-span-2">{u.phone}</div>
                                    <div>{u.accountBalance || "0"}</div>
                                    <div>{u.role}</div>
                                    <div className="col-span-2 flex justify-center">
                                        <Button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded-md font-bold"
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
