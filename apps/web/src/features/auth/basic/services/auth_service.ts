import { ApiIntance } from "../../../../infraestructure/api/config";

export type LoginRequestData = {
  email: string;
  password: string;
};

export type RegisterRequestData = LoginRequestData & {
  username: string;
};

class AuthenticationServices {
  login = async (data: LoginRequestData) => {
    const response = await ApiIntance.post("/auth/login", data);
    return response.data;
  };

  register = async (data: RegisterRequestData) => {
    const response = await ApiIntance.post("/auth/register", data);
    return response.data;
  };
}

export default new AuthenticationServices();
