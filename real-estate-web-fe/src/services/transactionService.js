import http from "./http";

export const transactionService = {
    getTransactionByAdmin: async (data) => {
        const res = await http.get(`transaction/admin/top-up/all`, data);
        return res.data.data;
    },
    getUserWalletByAdmin: async (userId) => {
        const res = await http.get(`transaction/admin/user/${userId}/wallet`);
        return res.data.data;
    },
    getUserWalletByUser: async (userId) => {
        const res = await http.get(`transaction/user/${userId}/wallet`);
        return res.data.data;
    },
    getUserTransactionHistoryByAdmin: async (userId) => {
        const res = await http.get(`transaction/admin/user/${userId}/history`);
        return res.data.data;
    },
    getTransactionSubscription: async (data) => {
        const res = await http.get("transaction/history/purchase", data);
        return res.data.data;
    },
    getUserTransaction: async () => {
        const res = await http.get("transaction/history/top-up");
        return res.data.data;
    },

    createTransaction: async (data) => {
        const res = await http.post(`transaction/top-up`, data);
        return res.data.data;
    },
    createBuyingSubscription: async (data) => {
        const res = await http.post(`transaction/purchase`, data);
        return res.data.data;
    }

}
