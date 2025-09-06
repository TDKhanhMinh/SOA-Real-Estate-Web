import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
export default function AccountLayout() {
    return (


        <div className="w-full flex flex-col min-h-screen">
            <Header />
            <main className="bg-gray-50 p-6 mt-20 flex flex-1">
                <Sidebar />
                <Outlet />
            </main>
            <Footer />
        </div>

    );
}
