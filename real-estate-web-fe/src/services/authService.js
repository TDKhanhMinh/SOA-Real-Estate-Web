import http from "./http";

export const authService = {
    login: async (username, password) => {
        const res = await http.post("api/auth/login", { username, password })
        localStorage.setItem("token", res.data)
        return res.data;
    },
    register: async (userName, password, email, role) => {
        try {
            const res = await http.post("api/auth/create", {
                userName,
                password,
                email,
                role,
            });
            return res.data; 
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Đăng ký thất bại");
            }
            throw new Error("Không thể kết nối server");
        }
    }
    ,
    logout: async () => {
        localStorage.removeItem("token");
        localStorage.clear();
    }

}
