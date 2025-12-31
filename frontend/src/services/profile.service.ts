import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { ProfileFormValues } from "@/lib/schema/profile.schema";

const ProfileService = {
    getMe: async () => {
        try {
            const response = await api.get("/profile/me");
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    updateProfile: async (data: ProfileFormValues) => {
        try {
            const response = await api.patch("/profile/me", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    uploadProfilePicture: async (file: File) => {
        try {
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
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
};

export default ProfileService;
