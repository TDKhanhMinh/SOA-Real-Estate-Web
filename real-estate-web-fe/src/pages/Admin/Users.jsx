import { useState, useEffect, useCallback } from "react";
import Button from './../../components/Button';
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import TextInput from "../../components/TextInput";
import { UserActionsModal } from "../../components/UserActionModal";
import { useDebounce } from "../../hooks/useDebounce";
import { SubscriptionModal } from "../../components/SubscriptionModal";
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        confirmPassword: "",
    });
    const [error, setError] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleLock = async (user) => {

        try {
            const payload = {
                name: user.name,
                phone: user.phone,
                isActive: false
            }
            const res = await userService.updateProfileByAdmin(user.id, payload);
            console.log(res);
            await fetchUsers();
            toast.success("Khóa người dùng thành công")

        } catch (error) {
            console.log(
                error
            );

        }

    };
    const handleOpenLock = async (user) => {

        try {
            const payload = {
                name: user.name,
                phone: user.phone,
                isActive: true
            }
            const res = await userService.updateProfileByAdmin(user.id, payload);
            console.log(res);
            await fetchUsers();
            toast.success("Mở khóa người dùng thành công")

        } catch (error) {
            console.log(
                error
            );

        }

    };
    const fetchUsers = useCallback(async () => {
        try {
            const response = await userService.findUserByEmailOrName(debouncedSearchTerm, page, 10);
            const userFilter = response.data.filter(user => user.role !== "ADMIN");
            console.log("User filter", userFilter);

            setUsers(userFilter || []);
            setTotalPages(response.totalPages || 0);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Không thể tải danh sách người dùng");
        }
    }, [debouncedSearchTerm, page]);
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
    }, [fetchUsers]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchTerm]);
    const handleOpenModal = (userID) => {
        setSelectedUser(userID)
        setIsModalOpen(true)
    };

    return (
        <main className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                    <p className="text-gray-500 text-sm mt-1">Xem, thêm mới và quản lý thông tin tài khoản</p>
                </div>

                <div className="mb-6">
                    {!showForm ? (
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div className="w-full md:w-1/3 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <TextInput
                                    type="text"
                                    label=""
                                    placeholder="Tìm kiếm tên, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>


                            <Button
                                onClick={() => setShowForm(true)}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium whitespace-nowrap"
                            >

                                Thêm người dùng
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    )}
                </div>


                {showForm && (
                    <div className="w-full bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100 animate-fade-in-down">
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Thêm tài khoản mới</h2>
                            <p className="text-gray-500 text-sm">Vui lòng điền đầy đủ thông tin bên dưới</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                                    <TextInput
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    {error.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                                    <TextInput
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                                    <TextInput
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone}</p>}
                                </div>

                                <div></div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                                    <TextInput
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                                    <TextInput
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    {error.confirmPassword && <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end mt-8 pt-4 border-t">
                                <Button
                                    type="submit"
                                    className="px-8 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg transform active:scale-95 transition"
                                >
                                    Xác nhận tạo mới
                                </Button>
                            </div>
                        </form>
                    </div>
                )}


                {!showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {users?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-16">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <img
                                        src="https://img.icons8.com/ios/100/9CA3AF/empty-box.png"
                                        alt="empty"
                                        className="w-16 h-16 opacity-50"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Không tìm thấy dữ liệu</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {searchTerm ? `Không có kết quả nào cho "${searchTerm}"` : "Chưa có người dùng nào được tạo."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="pl-2">ID</div>
                                    <div>Avatar</div>
                                    <div className="col-span-2">Full Name</div>
                                    <div className="col-span-2">Email</div>
                                    <div className="col-span-2">Phone</div>
                                    <div>Role</div>
                                    <div className="col-span-2 text-center">Action</div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {users?.map((u) => (
                                        <div
                                            key={u.id}
                                            className="grid grid-cols-12 items-center p-4 hover:bg-blue-50 transition-colors duration-150 text-sm text-gray-700"
                                        >
                                            <div className="font-medium pl-2 text-gray-500">#{u?.id}</div>
                                            <div>
                                                <img
                                                    src={u?.avatarUrl || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                                                    alt="avatar"
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                                />
                                            </div>
                                            <div className="col-span-2 font-semibold text-gray-900">{u.name}</div>
                                            <div className="col-span-2 text-gray-500 truncate pr-4" title={u.email}>{u.email}</div>
                                            <div className="col-span-2">{u.phone}</div>

                                            <div>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    {u.role}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex justify-between items-center w-full">
                                                <SubscriptionModal userId={u.id} />
                                                <button
                                                    onClick={() => handleOpenModal(u.id)}
                                                    className="flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1"
                                                >
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => { u.isActive ? handleLock(u) : handleOpenLock(u) }}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1"
                                                >
                                                    {u.isActive ? <CiLock className="w-8 h-8 text-red-600" /> : <CiUnlock className="w-8 h-8 text-green-600" />}

                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Trang <span className="font-medium">{page + 1}</span> / <span className="font-medium">{totalPages}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => setPage(curr => Math.max(0, curr - 1))}
                                                        disabled={page === 0}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setPage(curr => Math.min(totalPages - 1, curr + 1))}
                                                        disabled={page >= totalPages - 1}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page >= totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <UserActionsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={selectedUser}
                />
            </div>
        </main>
    );
}