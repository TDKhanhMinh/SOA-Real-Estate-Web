import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminGuard = () => {
    const { user, isLoading, isLoggedIn } = useAuth();

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (!isLoggedIn) {
        toast.info("Vui lòng đăng nhập")
        return <Navigate to="/login" replace />;
    }

    if (user?.email !== 'admin@gmail.com') {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;