import http from "./http";

export const subscriptionService = {
    getSubscriptionsByAdmin: async () => {
        const res = await http.get("subscription/admin/");
        return res.data;
    },
    getSubscriptionsByUser: async () => {
        const res = await http.get("subscription/");
        return res.data.data;
    }

}
