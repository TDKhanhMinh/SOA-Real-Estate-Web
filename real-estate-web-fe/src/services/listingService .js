import http from './http';
export const listingService = {
    // /public
    getAllListing: async (search, transactionType, propertyType, minPrice, maxPrice, page = 0, size = 10) => {
        const params = {
            search,
            transactionType,
            propertyType,
            minPrice,
            maxPrice,
            page,
            size,
        };
        console.log("params", params);

        const res = await http.get(`/listing/public`, { params });
        console.log("data lis", res);
        return res.data;
    },
    // /property/{id}
    // /property/{id}/submit
    submitDraftListing: async (id) => {
        const res = await http.post(`/listing/property/${id}/submit`);
        return res.data;
    },
    // /property/{id}/toggle-visibility
    hiddenListing: async (id) => {
        const res = await http.post(`/listing/property/${id}/toggle-visibility`);
        return res.data;
    },
    // /property/{id}/sold
    hasSoldListing: async (id) => {
        const res = await http.post(`/listing/property/${id}/sold`);
        return res.data;
    },
    // /property/{id}/rented
    hasRentedListing: async (id) => {
        const res = await http.post(`/listing/property/${id}/rented`);
        return res.data;
    },
    // /property/{id}
    updateListing: async (id, data) => {
        const res = await http.put(`/listing/property/${id}`, data);
        return res.data;
    },
    // /my-listings
    getUserListing: async (status, page = 0, size = 10) => {
        const params = {
            status,
            page,
            size,
        };
        const res = await http.get(`/listing/my-listings`, { params });
        console.log("user lis", res.data);

        return res.data;
    },
    // /my-history
    transferHistoryListing: async (status, page = 0, size = 10) => {
        const params = {
            status,
            page,
            size,
        };
        const res = await http.get(`/listing/my-history`, { params });
        return res.data;
    },
    // /property/{id}
    deleteListing: async (id) => {
        const res = await http.delete(`/listing/property/${id}`);
        return res.data;
    },
    // /admin/property/pending
    getUserListingByAdmin: async (status, page = 0, size = 10) => {
        const params = {
            status,
            page,
            size,
        };
        const res = await http.get(`/listing/admin/properties`, { params });
        return res.data;
    },
    // /admin/user/{userId}/properties
    getUserAllUserListingByAdmin: async (userId, page = 0, size = 10) => {
        const params = {
            includeDeleted: true,
            page,
            size,
        };
        const res = await http.get(`/listing/admin/user/${userId}/properties`, { params });
        return res.data;
    },
    // /admin/property/{id}
    // /admin/property/{id}/approve
    approveListing: async (id, data) => {
        const res = await http.post(`/listing/admin/property/${id}/approve`, data);
        return res.data;
    },
    // /public/{id}
    getListingDetails: async (id) => {
        const res = await http.get(`/listing/public/${id}`);
        return res.data.data;
    },
    // /property
    createListing: async (data) => {
        const res = await http.post(`/listing/property`, data);
        return res.data;
    }
}