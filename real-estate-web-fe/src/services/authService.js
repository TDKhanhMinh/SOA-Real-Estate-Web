import http from "./http";

export const authService = {
    login: async (email, password) => {
        const res = await http.post("user/login", { email, password })
        localStorage.setItem("token", res.data.data.token)
        console.log("Login data return",res.data.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.data.user))
        console.log("Login data return",res.data.data.token);

        return res.data;
    },
    register: async (name, password, email, phone) => {
        const userData = { name, password, email, phone };
        try {
            console.log("User data", userData);
            const res = await http.post("user/register", userData);
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
