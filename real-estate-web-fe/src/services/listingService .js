import http from './http';
export const listingService = {
    // /property
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
    // /property/{id}/rented
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
            sort: "id,asc"
        };
        const res = await http.get(`/listing/my-listings`, { params });
        return res.data;
    },
    // /my-history
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
            sort: "id,asc"
        };
        const res = await http.get(`/listing/admin/property/pending`, { params });
        return res.data;
    },
    // /admin/user/{userId}/properties
    getUserAllUserListingByAdmin: async (userId, status, includeDeleted, page = 0, size = 10) => {
        const params = {
            status,
            includeDeleted,
            page,
            size,
            sort: "id,asc"
        };
        const res = await http.get(`/listing/admin/user/$${userId}/properties`, { params });
        return res.data;
    },
    // /admin/property/{id}
    // /admin/property/{id}/approve
    approveListing: async (id, data) => {
        const res = await http.post(`/listing/admin/property/${id}/approve`, data);
        return res.data;
    },
    // /public
    // /public/{id}
    createListing: async (data) => {
        const res = await http.post(`/listing/property`, data);
        return res.data;
    }
}