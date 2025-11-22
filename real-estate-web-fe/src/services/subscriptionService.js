import http from "./http";

export const subscriptionService = {
    getSubscriptionsByAdmin: async () => {
        const res = await http.get("subscription/admin/");
        console.log("subbb", res);
        return res.data.data;
    },
    getSubscriptionsByUser: async () => {
        const res = await http.get("subscription/");
        return res.data.data;
    },
    getSubscriptionsById: async (subscriptionId) => {
        const res = await http.get(`subscription/${subscriptionId}`);
        return res.data.data;
    },
    ///user/history
    getSubscriptionsPaymentHistory: async (data) => {
        const res = await http.get(`subscription/admin/orders`, data);
        return res.data.data;
    },
    getUserPresentSubscriptionsByUserId: async (userId) => {
        const res = await http.get(`subscription/user/${userId}`);
        return res.data.data;
    },
    getUserSubscriptionsHistoryByAdmin: async (userId) => {
        const res = await http.get(`subscription/admin/user/${userId}/history`);
        return res.data.data;
    },

    getUserSubscriptions: async () => {
        const res = await http.get("subscription/user/");
        return res.data.data;
    },
    getUserSubscriptionsHistory: async () => {
        const res = await http.get("subscription/user/history");
        return res.data.data;
    },
    updateSubscriptions: async (id, data) => {
        const res = await http.put(`subscription/admin/${id}`, data);
        return res.data.data;
    },
    createSubscriptions: async (data) => {
        const res = await http.post(`subscription/admin`, data);
        return res.data.data;
    },
    // /admin/assign/user/{userId}/{subscriptionId}
    donateSubscriptions: async (userId, subscriptionId) => {
        const res = await http.post(`subscription/admin/assign/user/${userId}/${subscriptionId}`);
        return res.data.data;
    },
    cancelSubscriptions: async () => {
        const res = await http.post(`subscription/user/cancel`);
        return res.data.data;
    },
    buySubscriptions: async (subscriptionId) => {
        const res = await http.post(`subscription/user/purchase/${subscriptionId}`);
        console.log("sub buy data", res.data);

        return res.data.data;
    },
    getUserSubscriptionsRevenue: async (data) => {
        const res = await http.get("subscription/admin/stats/revenue", data);
        return res.data.data;
    },
    getUserPerSubscriptions: async () => {
        const res = await http.get("subscription/admin/stats/users");
        return res.data.data;
    },


}
