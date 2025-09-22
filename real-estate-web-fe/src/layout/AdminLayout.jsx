import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    FaBars,
    FaChartPie,
    FaUsers,
    FaUser,
} from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import Button from './../components/Button';
import { MdPayment } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { ToastContainer } from "react-toastify";

function AdminLayout() {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-gradient-to-b from-indigo-700 to-purple-800 hover:bg-white/20 text-white transition-all ${open ? "w-60" : "w-16"}`}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <h1 className={`${open ? "block" : "hidden"} font-bold`}>Admin Dashboard</h1>
                    <Button className="flex items-center" onClick={() => setOpen(!open)}>
                        <FaBars />
                    </Button>
                </div>

                <ul className="mt-4 space-y-2">
                    <li>
                        <Button
                            to="/admin/dashboard"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <FaChartPie /> {open && "Dashboard"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/listings"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <TbCategory /> {open && "Listings"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/users"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <FaUsers /> {open && "Users"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/payments"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <MdPayment /> {open && "Payments"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/memberships"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <LuCrown /> {open && "Memberships"}
                        </Button>
                    </li>

                    <li>
                        <Button
                            to="/"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
                        >
                            <CiLogout /> {open && "Logout"}
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-sky-600 h-14 px-6 py-4 shadow-lg ">
                    
                </div>

                {/* Nội dung page con */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        draggable
                        theme="colored"      
                    />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
