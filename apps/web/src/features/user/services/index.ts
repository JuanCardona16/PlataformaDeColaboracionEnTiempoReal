import { ApiIntance } from "../../../infraestructure/api/config";

class ProfileServices {
  getProfile = async () => {
    const response = await ApiIntance.get("/profile");
    return response.data;
  };

  getOnlineUsers = async (userIds: string[]) => {
    const response = await ApiIntance.post("/profile/batch", userIds);
    return response.data;
  };
}

export default new ProfileServices();
