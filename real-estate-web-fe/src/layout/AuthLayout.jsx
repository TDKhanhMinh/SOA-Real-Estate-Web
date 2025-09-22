
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
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
            </main>
            <Footer />
        </div>
    );
}
