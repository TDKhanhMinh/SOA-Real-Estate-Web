import http from "./http";

export const uploadService = {
    uploadImage: async (data) => {
        const res = await http.post('upload/image', data);
        return res.data;
    }

}
