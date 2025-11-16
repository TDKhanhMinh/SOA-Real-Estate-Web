import http from "./http";

export const subscriptionService = {
    getSubscriptionsByAdmin: async () => {
        const res = await http.get("subscription/admin/");
        return res.data.data;
    },
    getSubscriptionsByUser: async () => {
        const res = await http.get("subscription/");
        return res.data.data;
    },
    getUserSubscriptions: async () => {
        const res = await http.get("subscription/user/");
        return res.data.data;
    },
    updateSubscriptions: async (id, data) => {
        const res = await http.put(`subscription/admin/${id}`, data);
        return res.data.data;
    },
    createSubscriptions: async (data) => {
        const res = await http.post(`subscription/admin`, data);
        return res.data.data;
    }

}
