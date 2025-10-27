import { ApiIntance } from "../../../infraestructure/api/config";

class ProfileServices {
  getProfile = async () => {
    const response = await ApiIntance.get("/profile");
    return response.data;
  };

}

export default new ProfileServices();
