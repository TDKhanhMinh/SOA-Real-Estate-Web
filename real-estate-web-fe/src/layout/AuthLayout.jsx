
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { ToastContainer } from "react-toastify";
import Header from './../components/layout/Header';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
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
