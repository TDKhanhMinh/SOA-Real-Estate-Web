import http from "./http";

export const userService = {
    getAllUsers: async () => {
        const res = await http.get("user/");
        return res.data.data.data;
    },
    getUserById: async (id) => {
        const res = await http.get(`user/${id}`);
        return res.data.data;
    },
    findUserByEmailOrName: async (keyword = "", page = 0, size = 10) => {
        const params = {
            page,
            size,
            sort: "id,asc"
        };
        if (keyword) {
            params.keyword = keyword;
        }
        const res = await http.get(`user/search`, { params });
        console.log("Search", res.data);

        return res.data.data;
    },
    getProfile: async () => {
        const res = await http.get("user/profile");
        return res.data.data;
    },
    updateProfile: async (data) => {
        const res = await http.put("user/profile", data);
        return res.data.data;
    },
    updateProfileByAdmin: async (id, data) => {
        const res = await http.put(`user/${id}`, data);
        return res.data;
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
        const res = await http.post("user/verify-otp", data);
        return res.data.data;
    },
    resetPassword: async (data) => {
        const res = await http.post("user/reset-password", data);
        return res.data.data;
    },

}
