import http from "./http";

export const userService = {
    getAllUsers: async () => {
        const res = await http.get("user/");
        return res.data.data.data;
    },
    getProfile: async () => {
        const res = await http.get("user/profile");
        return res.data.data;
    },
    updateProfile: async (data) => {
        const res = await http.put("user/profile", data);
        return res.data.data;
    },
    changePassword: async (data) => {
        const res = await http.put("user/change-password", data);
        return res.data.data;
    },
    forgotPassword: async (data) => {
        const res = await http.post("user/forgot-password", data);
        return res.data.data;
    },
    verifyOTP: async (data) => {
        const res = await http.post("user/otp-verification", data);
        return res.data.data;
    },
}
