
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layout/MainLayout";
import Login from './../pages/Auth/Login';
import Register from './../pages/Auth/Register';
import Post from "../pages/Post";
import ListingInfo from "../pages/ListingInfo";
import AccountLayout from "../layout/AccountLayout";
import UserListing from "../pages/UserListing";
import Membership from "../pages/MemberShip";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ChangePassword from "../pages/Auth/ChangePassword";
import SupportCenter from "../pages/SupportCenter";
import SearchResult from "../pages/SearchResult";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Admin/DashBoard";
import Users from "../pages/Admin/Users";
import Listings from "../pages/Admin/Listings";
import Payments from "../pages/Admin/Payments";
import MembershipManagement from "../pages/Admin/Membership";
import AuthLayout from "../layout/AuthLayout";
import OtpVerification from "../pages/Auth/OtpVerification";
import ResetPassword from "../pages/Auth/ResetPassword";
import MySubscription from "../pages/MySubscription";
import Payment from "../pages/Payment/Payment";
import MomoPayment from "../pages/Payment/MomoPayment";
import VnPayPayment from "../pages/Payment/VnPayPayment";
import PaymentHistory from "../pages/Payment/PaymentHistory";


const publicRoutes = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/', element: <Home />
            },

            {
                path: '/post', element: <Post />
            },
            {
                path: '/info/:id?', element: <ListingInfo />
            },

            {
                path: '/search-result', element: <SearchResult />
            },

        ],
    }, {
        element: <AccountLayout />,
        path: '/account',
        children: [
            {
                path: 'change-password', element: <ChangePassword />
            },
            {
                path: 'listing', element: <UserListing />
            },
            {
                path: 'membership', element: <Membership />
            },
            {
                path: 'profile', element: <Profile />
            },
            {
                path: 'support', element: <SupportCenter />
            },
            {
                path: 'my-subscription', element: <MySubscription />
            },
            {
                path: 'payment', element: <Payment />
            },
            {
                path: 'payment-history', element: <PaymentHistory />
            },
            {
                path: 'momo', element: <MomoPayment />
            },
            {
                path: 'vnpay', element: <VnPayPayment />
            },

        ],
    }
    , {
        element: <AdminLayout />,
        path: '/admin',
        children: [
            {
                path: 'dashboard', element: <Dashboard />
            },
            {
                path: 'users', element: <Users />
            },
            {
                path: 'listings', element: <Listings />
            },
            {
                path: 'payments', element: <Payments />
            },
            {
                path: 'memberships', element: <MembershipManagement />
            },



        ],
    }, {
        element: <AuthLayout />,
        children: [
            {
                path: '/login', element: <Login />
            },
            {
                path: '/register', element: <Register />
            },
            {
                path: '/forgot-password', element: <ForgotPassword />
            },
            {
                path: '/otp-verification', element: <OtpVerification />
            },
            {
                path: '/reset-password', element: <ResetPassword />
            },




        ],
    }

])
const privateRoutes = []

export { publicRoutes, privateRoutes }