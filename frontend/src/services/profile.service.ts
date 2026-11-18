import { api } from "@/lib/api";
import { UpdateProfileInput } from "@fieldmax/shared";

const ProfileService = {
    getMe: async () => {
        const response = await api.get("/profile/me");
        return response.data;
    },

    updateProfile: async (data: UpdateProfileInput) => {
        const response = await api.patch("/profile/me", data);
        return response.data;
    },

    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await api.post("/uploads/profile/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    uploadCompanyLogo: async (file: File) => {
        const formData = new FormData();
        formData.append("logo", file);

        const response = await api.post("/uploads/company-logo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};

export default ProfileService;
