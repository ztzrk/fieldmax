import { api } from "@/lib/api";
import { ProfileFormSchema } from "@fieldmax/shared";

const ProfileService = {
    getMe: async () => {
        const response = await api.get("/profile/me");
        return response.data;
    },

    updateProfile: async (data: ProfileFormSchema) => {
        const response = await api.patch("/profile/me", data);
        return response.data;
    },

    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await api.post(
            "/uploads/profile/photo",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },
};

export default ProfileService;
