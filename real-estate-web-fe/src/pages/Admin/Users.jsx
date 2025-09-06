import { useState, useEffect } from "react";
import Button from './../../components/Button';

export default function Users() {
    // Mock data
    const [users, setUsers] = useState([
        {
            userId: 1,
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0912345678",
            accountBalance: "5,000,000",
            roles: [{ name: "USER" }],
            images: {
                imageUrl:
                    "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg",
            },
        },
        {
            userId: 2,
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0987654321",
            accountBalance: "2,000,000",
            roles: [{ name: "ADMIN" }],
            images: null,
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [notification, setNotification] = useState("Thêm người dùng thành công!");

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleAddUser = (e) => {
        e.preventDefault();
        setUsers([
            ...users,
            {
                userId: users.length + 1,
                fullName: "Người dùng mới",
                email: "newuser@example.com",
                phone: "0909999999",
                accountBalance: "0",
                roles: [{ name: "USER" }],
                images: null,
            },
        ]);
        setShowForm(false);
        setNotification("Người dùng mới đã được thêm!");
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter((u) => u.userId !== id));
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

            {/* Add User Form */}
            {showForm && (
                <div className="flex justify-center w-full inline">
                    <form
                        onSubmit={handleAddUser}
                        className="space-y-4 bg-white p-6 rounded-lg shadow-md border max-w-lg w-full inline"
                    >
                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <input
                                type="tel"
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Repeat Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Register
                        </Button>
                    </form>
                </div>
            )}

            {/* Users Table */}
            {!showForm && (
                <div className="mt-6">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md">
                            <img
                                src="https://img.icons8.com/ios/100/000000/empty-box.png"
                                alt="empty"
                            />
                            <p className="text-gray-600 text-lg mt-4">There is no user</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Header */}
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

                            {/* Users */}
                            {users.map((u) => (
                                <div
                                    key={u.userId}
                                    className="grid grid-cols-12 bg-white shadow mt-2 items-center p-4"
                                >
                                    <div>{u.userId}</div>
                                    <img
                                        src={
                                            u.images?.imageUrl ||
                                            "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
                                        }
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="col-span-2">{u.fullName}</div>
                                    <div className="col-span-2">{u.email}</div>
                                    <div className="col-span-2">{u.phone}</div>
                                    <div>{u.accountBalance}</div>
                                    <div>{u.roles.map((r) => r.name).join(", ")}</div>
                                    <div className="col-span-2 flex justify-center">
                                        <Button
                                            onClick={() => handleDeleteUser(u.userId)}
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
